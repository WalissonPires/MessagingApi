import { Client, LocalAuth } from "whatsapp-web.js";
import WAWebJS = require("whatsapp-web.js");
import { Message, MessageMedia, MessageReceivedHandler, MimeTypeMdiaLink, QrCodeResult, Status, StatusResult } from "../messaging";
import { ClientMeta, WhatsAppClientsCtrl } from "./clients-ctrl";
import { IWhatsAppService } from "./base";
import { Chatbot } from "../../use-cases/chatbot";

export class WhatsAppService implements IWhatsAppService {

    private _options: WhatsAppServiceOptions;
    private _client!: Client;
    private _meta!: Omit<ClientMeta, 'client'>;

    constructor(options: WhatsAppServiceOptions) {

        this._options = options;
        this.setup();
    }

    public async initialize(): Promise<void> {

        let state = WAWebJS.WAState.UNLAUNCHED;

        try {
            state =  await this._client.getState();
        }
        catch(error) {
            // console.error(error);

            /* errors
            - TypeError: Cannot read properties of null (reading 'evaluate'). this._client.pupPage is null (First call)
            - Session closed. Most likely the page has been closed (After disconnect whatsapp)
            */
        }

        if (state === WAWebJS.WAState.UNLAUNCHED) {
            console.log('[WhatsAppService] Execute initialize from state ' + state);
            this._client.initialize();

            this._meta.status = Status.Initializing;
            this.saveClientMeta();
        }
    }

    public async finalize(): Promise<void> {

        let state = WAWebJS.WAState.UNLAUNCHED;

        try {
            state =  await this._client.getState();
        }
        catch(error) {
            // console.error(error);

            /* errors
            - TypeError: Cannot read properties of null (reading 'evaluate'). this._client.pupPage is null (First call)
            - Session closed. Most likely the page has been closed (After disconnect whatsapp)
            */
        }

        if (state !== WAWebJS.WAState.CONNECTED)
            return;

        try {
            await this._client.logout();
            //await this._client.destroy();
        }
        catch(error) {
            //console.error(error);
        }

        this._meta.status = Status.Uninitialized;
        Chatbot.clearFromProvider(this.getProviderId());
        this.saveClientMeta();
    }

    public async getQrCode(): Promise<QrCodeResult> {

        return {
            qrCodeContent: this._meta.lastQrCode ?? ''
        };
    }

    public async sendMessage(message: Message): Promise<void> {

        const mediasCount = message.medias?.length ?? 0;
        const media = mediasCount == 1 ? message.medias?.at(0) : null;
        const destination = message.to + '@c.us';

        console.log('Send message to ' + destination);

        const sendMedia = async (media: MessageMedia) => {

            const messageMedia = media.mimeType === MimeTypeMdiaLink ? await WAWebJS.MessageMedia.fromUrl(media.fileBase64) : new WAWebJS.MessageMedia(media.mimeType, media.fileBase64);

            await this._client.sendMessage(destination, messageMedia, {
                caption: media.label,
                sendAudioAsVoice: false
            });
        }

        if (message.content) {

            await this._client.sendMessage(destination, message.content, {
                media: media ? new WAWebJS.MessageMedia(media.mimeType, media.fileBase64) : undefined
            });
        }
        else if (media) {

            await sendMedia(media);
        }

        if (message.medias && message.medias.length > 1) {

            for(const media of message.medias) {

                await sendMedia(media);
            }
        }
    }

    public async getState(): Promise<StatusResult> {

        return {
            status: this._meta.status,
            message: this._meta.status === Status.Error ? this._meta.lastError : undefined,
        };
    }

    public removeAllListenersMessageReceived() {

        this._client.removeAllListeners('message');
    }

    public addListenerMessageReceived(handler: MessageReceivedHandler) {

        this._client.on('message', async (message) => {

            if (message.from.startsWith(this._client.info.wid.user) || message.from === 'status@broadcast')
                return;

            const from = message.from.substring(0, message.from.indexOf('@'));

            // skip number format 553391044866-1570709760
            if (from.indexOf('-') >= 0)
                return;

            handler({
                providerId: this.getProviderId(),
                message: {
                    from,
                    content: message.body
                }
            });
        });
    }


    private setup() {

        const clientMeta = WhatsAppClientsCtrl.getClientMeta(this._options.clientId);

        if (clientMeta) {

            const { client, ...meta } = clientMeta;
            this._client = client;
            this._meta = meta;

            return;
        }

        this._meta = {
            clientId: this._options.clientId,
            status: Status.Uninitialized
        };

        this._client = new Client({
            authStrategy: new LocalAuth({ clientId: this._options.clientId }), //new RemoteAuth({ clientId: options.clientId, store: new Storage(), backupSyncIntervalMs: 1000 * 60 }),
            puppeteer: {
                executablePath: process.env.BROWSER_PATH,
                headless: process.env.PUPPERTER_HEADLESS != 'false',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            // webVersionCache: {
            //     type: 'remote',
            //     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2403.3-beta.html'
            // }
            //webVersion: "2.2325.3" // Essa versão rodando o chrome da o erro: Código de erro: Out of Memory
        });

        this._client.on('qr', (qr) => {

            console.log('[WhatsAppService] QrCode received: ' + qr);

            this._meta.lastQrCode = qr;
            this._meta.status = Status.WaitQrCodeRead;
            this.saveClientMeta();
        });

        this._client.on('authenticated', () => {

            this._meta.lastError = undefined;
            this._meta.lastQrCode = undefined;
            this.saveClientMeta();

            console.log('[WhatsAppService] Authenticated');
        });

        this._client.on('auth_failure', msg => {

            console.log('[WhatsAppService] Authenticate Fail');

            this._meta.lastError = msg;
            this._meta.lastQrCode = undefined;
            this._meta.status = Status.Error;
            this.saveClientMeta();
        });

        this._client.on('ready', () => {

            console.log('[WhatsAppService] Ready');

            this._meta.status = Status.Ready;
            this.saveClientMeta();
        });

        this._client.on('change_state', state => {

            console.log('[WhatsAppService] State changed: ' + state);
        });

        this._client.on('disconnected', (reason) => {

            console.log('[WhatsAppService] Disconnected: ' + reason);

            this._meta.status = Status.Uninitialized;
            this.saveClientMeta();
        });

        this.saveClientMeta();
    }

    private saveClientMeta() {

        WhatsAppClientsCtrl.saveClientMeta({
            ...this._meta,
            client: this._client
        });
    }

    private getProviderId() {

        return parseInt(this._meta.clientId.replace('provider-', ''));
    }
}


interface WhatsAppServiceOptions {
    clientId: string;
}

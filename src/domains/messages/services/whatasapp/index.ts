import { Client, LocalAuth } from "whatsapp-web.js";
import WAWebJS = require("whatsapp-web.js");
import { Message, QrCodeResult, Status, StatusResult } from "../messaging";
import { ClientMeta, WhatsAppClientsCtrl } from "./clients-ctrl";
import { IWhatsAppService } from "./base";

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

    public async getQrCode(): Promise<QrCodeResult> {

        return {
            qrCodeContent: this._meta.lastQrCode ?? ''
        };
    }

    public async sendMessage(message: Message): Promise<void> {

        await this._client.sendMessage(message.to + '@c.us', message.content);
    }

    public async getState(): Promise<StatusResult> {

        return {
            status: this._meta.status,
            message: this._meta.status === Status.Error ? this._meta.lastError : undefined,
        };
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
                headless: process.env.PUPPERTER_HEADLESS != 'false',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
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
}


interface WhatsAppServiceOptions {
    clientId: string;
}

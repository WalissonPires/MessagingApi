import { Message, MessageReceivedContext, MessageReceivedHandler, MessegingService, MessegingServiceAuthQrCode, MessegingServiceReceiver, QrCodeResult, Status, StatusResult } from "../messaging";
import { IWhatsappEvolutionConfig } from "../../../providers/entities/whatsapp-evolution-config";

export class WhatsappEvolutionService implements MessegingService, MessegingServiceAuthQrCode, MessegingServiceReceiver {

    private _config: IWhatsappEvolutionConfig;
    private _providerId: number;
    private _handlers: MessageReceivedHandler[] = [];

    constructor(providerId: number, config: IWhatsappEvolutionConfig) {
        this._providerId = providerId;
        this._config = config;
    }

    public async initialize(): Promise<void> {
        // Não tem nada pra fazer no evolution nessa situação.
    }

    public async finalize(): Promise<void> {
        try {
            await fetch(`${this._config.apiUrl}/instance/logout/${this._config.instanceName}`, {
                method: 'DELETE',
                headers: {
                    'apikey': this._config.token
                }
            });
        } catch (error) {
            console.error('[WhatsappEvolutionService] Error during logout:', error);
        }
    }

    public async getState(): Promise<StatusResult> {
        try {
            const response = await fetch(`${this._config.apiUrl}/instance/connectionState/${this._config.instanceName}`, {
                headers: {
                    'apikey': this._config.token
                }
            });

            if (!response.ok) return { status: Status.Error, message: 'Instance not found' };

            const data = await response.json();
            const state = data.instance?.state;

            if (state === 'open') return { status: Status.Ready };
            // Enviar esses status impedi obter o QR CODE.
            //if (state === 'connecting') return { status: Status.Initializing };
            //if (state === 'close') return { status: Status.Uninitialized };

            return { status: Status.WaitQrCodeRead };
        } catch (error) {
            return { status: Status.Error, message: (error as Error).message };
        }
    }

    public async sendMessage(message: Message): Promise<void> {
        const hasMedia = message.medias && message.medias.length > 0;

        if (hasMedia) {
            for (const media of message.medias!) {
                await fetch(`${this._config.apiUrl}/message/sendMedia/${this._config.instanceName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this._config.token
                    },
                    body: JSON.stringify({
                        number: message.to,
                        media: media.fileBase64,
                        mediatype: media.mimeType.split('/')[0] || 'document',
                        mimetype: media.mimeType,
                        caption: message.content || media.label || ''
                    })
                });
            }
        } else {
            await fetch(`${this._config.apiUrl}/message/sendText/${this._config.instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this._config.token
                },
                body: JSON.stringify({
                    number: message.to,
                    text: message.content
                })
            });
        }
    }

    public addListenerMessageReceived(handler: MessageReceivedHandler): void {
        this._handlers.push(handler);
    }

    public async getQrCode(): Promise<QrCodeResult> {
        try {
            const response = await fetch(`${this._config.apiUrl}/instance/connect/${this._config.instanceName}`, {
                headers: {
                    'apikey': this._config.token
                }
            });

            const data = await response.json();
            return {
                qrCodeContent: data.code || ''
            };
        } catch (error) {
            console.error('[WhatsappEvolutionService] Error getting QR Code:', error);
            return { qrCodeContent: '' };
        }
    }

    public async processMessage(payload: any): Promise<void> {
        if (payload.event !== 'messages.upsert') return;

        const messageData = payload.data;
        if (!messageData || messageData.key.fromMe) return;

        const from = messageData.key.remoteJid.split('@')[0];
        const content = messageData.message?.conversation || messageData.message?.extendedTextMessage?.text || '';

        const context: MessageReceivedContext = {
            providerId: this._providerId,
            message: { from, content }
        };

        for (const handler of this._handlers) {
            try {
                await handler(context);
            } catch (error) {
                console.error('[WhatsappEvolutionService] Error in message handler:', error);
            }
        }
    }
}

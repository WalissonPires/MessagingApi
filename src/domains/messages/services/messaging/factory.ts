import { MessegingService } from ".";
import { ProviderType } from "../../../providers/entities/provider";
import { WhatsAppService } from "../whatasapp";

export class MessagingFactory {

    public getService(options: MessegingFactoryOptions): MessegingService {

        if (options.providerType === ProviderType.Whatsapp) {

            return new WhatsAppService({
                clientId: 'provider-' + options.providerId
            });
        }

        throw new Error('Provider not supported: ' + options.providerType);
    }
}

export interface MessegingFactoryOptions {
    providerId: number;
    providerType: ProviderType;
}
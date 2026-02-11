import { MessegingService } from ".";
import { ProviderType } from "../../../providers/entities/provider";
import { WhatsAppService } from "../whatasapp";
import { WhatsappEvolutionService } from "../evolution";
import { IWhatsappEvolutionConfig } from "../../../providers/entities/whatsapp-evolution-config";

export class MessagingFactory {

    public getService(options: MessegingFactoryOptions): MessegingService {

        if (options.providerType === ProviderType.Whatsapp) {

            return new WhatsAppService({
                clientId: 'provider-' + options.providerId
            });
        }

        if (options.providerType === ProviderType.WhatsappEvolution) {

            return new WhatsappEvolutionService(
                options.providerId,
                options.config as IWhatsappEvolutionConfig
            );
        }

        throw new Error('Provider not supported: ' + options.providerType);
    }
}

export interface MessegingFactoryOptions {
    providerId: number;
    providerType: ProviderType;
    config?: any;
}
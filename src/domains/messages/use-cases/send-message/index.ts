import { AppError } from "../../../../common/errors/app-error";
import { UseCase } from "../../../../common/use-cases";
import { ProviderServices } from "../../../providers/di-register";
import { FindProviders } from "../../../providers/queries/find-providers";
import { ProviderStatusUtils } from "../../../providers/utils/ProviderStatusUtils";
import { MessagesServices } from "../../di-register";
import { Status } from "../../services/messaging";
import { MessagingFactory } from "../../services/messaging/factory";


export class SendMessage implements UseCase<SendMessageInput, SendMessageStatus[]> {

    private _findProviders: FindProviders;
    private _messagingFactory: MessagingFactory;

    constructor({ findProviders, messagingFactory }: ProviderServices & MessagesServices) {

        this._findProviders = findProviders;
        this._messagingFactory = messagingFactory;
    }

    public async execute(input: SendMessageInput): Promise<SendMessageStatus[]> {

        const result: SendMessageStatus[] = [];
        const providers = await this._findProviders.execute({});

        for(const provider of providers) {

            try {
                const service = this._messagingFactory.getService({ providerId: provider.id, providerType: provider.type });

                const { status } = await service.getState();

                if (status !== Status.Ready)
                    continue;

                await service.sendMessage({
                    to: input.to,
                    content: input.content
                });

                result.push({
                    providerId: provider.id,
                    success: true,
                    errorMessage: null
                });
            }
            catch(error) {

                result.push({
                    providerId: provider.id,
                    success: false,
                    errorMessage: AppError.parse(error).message
                })
            }
        }

        return result;
    }

}

export interface SendMessageInput {

    to: string;
    content: string;
}

export interface SendMessageStatus {
    providerId: number;
    success: boolean;
    errorMessage: string | null;
}
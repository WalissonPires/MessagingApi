import { AppError } from "../../../../common/errors/app-error";
import { UseCase } from "../../../../common/use-cases";
import { ProviderServices } from "../../../providers/di-register";
import { FindProviders } from "../../../providers/queries/find-providers";
import { MessagesServices } from "../../di-register";
import { Status } from "../../services/messaging";
import { MessagingFactory } from "../../services/messaging/factory";
import { SendMessageValidator } from "./validator";


export class SendMessage implements UseCase<SendMessageInput, SendMessageStatus[]> {

    private _findProviders: FindProviders;
    private _messagingFactory: MessagingFactory;

    constructor({ findProviders, messagingFactory }: ProviderServices & MessagesServices) {

        this._findProviders = findProviders;
        this._messagingFactory = messagingFactory;
    }

    public async execute(input: SendMessageInput): Promise<SendMessageStatus[]> {

        input = this.validate(input);

        const result: SendMessageStatus[] = [];
        let providers = await this._findProviders.execute({});

        if (input.providers?.length! > 0) {
            providers = providers.filter(provider => input.providers!.some(x => x.id === provider.id));
        }

        for(const provider of providers) {

            try {
                const service = this._messagingFactory.getService({ providerId: provider.id, providerType: provider.type });

                const { status } = await service.getState();

                if (status !== Status.Ready) {

                    result.push({
                        providerId: provider.id,
                        success: false,
                        errorMessage: 'Provider is not ready'
                    });

                    continue;
                }

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

    private validate(input: SendMessageInput) {

        const result = new SendMessageValidator().validate(input);

        if (!result.success)
            throw new AppError(AppError.InvalidFieldsMessage, result.errors);

        return result.data!;
    }
}

export interface SendMessageInput {

    to: string;
    content: string;
    providers?: {
        id: number;
    }[];
}

export interface SendMessageStatus {
    providerId: number;
    success: boolean;
    errorMessage: string | null;
}
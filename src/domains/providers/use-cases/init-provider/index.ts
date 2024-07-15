import { AppError } from "../../../../common/errors/app-error";
import { UseCase } from "../../../../common/use-cases";
import { MessagesServices } from "../../../messages/di-register";
import { Status } from "../../../messages/services/messaging";
import { MessagingFactory } from "../../../messages/services/messaging/factory";
import { Chatbot } from "../../../messages/use-cases/chatbot";
import { ProviderServices } from "../../di-register";
import { GetProviderById } from "../../queries/get-provider-by-id";


export class InitProvider implements UseCase<InitProviderInput, void> {

    private _getProviderById: GetProviderById;
    private _messagingFactory: MessagingFactory;

    constructor({ getProviderById, messagingFactory }: ProviderServices & MessagesServices) {

        this._messagingFactory = messagingFactory;
        this._getProviderById = getProviderById;
    }

    public async execute(input: InitProviderInput): Promise<void> {

        const provider = await this._getProviderById.execute({
            providerId: input.providerId
        });

        if (!provider)
            throw new AppError('Provider not found');

        const service = this._messagingFactory.getService({
            providerId: provider.id,
            providerType: provider.type
        });

        const { status } = await service.getState();
        if (status !== Status.Uninitialized)
            return;

        await service.initialize();

        Chatbot.registerProviderListerner(input.providerId, service);
    }
}

export interface InitProviderInput {
    providerId: number;
}
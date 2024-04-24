import { AppError } from "../../../../common/errors/app-error";
import { UseCase } from "../../../../common/use-cases";
import { Chatbot } from "../../../messages/use-cases/chatbot";
import { ChatNode } from "../../../messages/utils/chatbot";
import { ProviderServices } from "../../di-register";
import { GetProviderById } from "../../queries/get-provider-by-id";
import { ProvidersRepository } from "../../repositories/providers-repository";
import { UpdateProviderChatbotFlowValidador } from "./validator";

export class UpdateProviderChatbotFlow implements UseCase<UpdateProviderChatbotFlowInput, void> {

    private _getProviderById: GetProviderById;
    private _providersRepository: ProvidersRepository;

    constructor({ getProviderById, providersRepository }: ProviderServices) {

        this._getProviderById = getProviderById;
        this._providersRepository = providersRepository;
    }

    public async execute(input: UpdateProviderChatbotFlowInput): Promise<void> {

        this.validate(input);

        const provider = await this._getProviderById.execute({
            providerId: input.providerId
        });

        if (!provider)
            return;

        provider.config = {
            ...provider.config,
            chatbotMessages: input.chatbotFlow
        };

        await this._providersRepository.update(provider);

        Chatbot.clearFromProvider(provider.id);
    }

    private validate(input: UpdateProviderChatbotFlowInput) {

        const result = new UpdateProviderChatbotFlowValidador().validate(input);

        if (!result.success)
            throw new AppError(AppError.InvalidFieldsMessage, result.errors);

        return result.data!;
    }
}

export interface UpdateProviderChatbotFlowInput {
    providerId: number;
    chatbotFlow: ChatNode;
}
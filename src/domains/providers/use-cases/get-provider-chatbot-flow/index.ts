import { UseCase } from "../../../../common/use-cases";
import { IProviderConfigChatbotFlow } from "../../../messages/use-cases/chatbot/base";
import { ChatNode } from "../../../messages/utils/chatbot";
import { ProviderServices } from "../../di-register";
import { GetProviderById } from "../../queries/get-provider-by-id";

export class GetProviderChatbotFlow implements UseCase<GetProviderChatbotFlowInput, ChatNode | null> {

    private _getProviderById: GetProviderById;

    constructor({ getProviderById }: ProviderServices) {

        this._getProviderById = getProviderById;
    }

    public async execute(input: GetProviderChatbotFlowInput): Promise<ChatNode | null> {

        const provider = await this._getProviderById.execute({
            providerId: input.providerId
        });

        if (!provider?.config)
            return null;

        const node = (provider.config as IProviderConfigChatbotFlow)?.chatbotMessages;
        return node ?? null;
    }

}

export interface GetProviderChatbotFlowInput {
    providerId: number;
}
import { AppError } from "@/common/errors/app-error";
import { UseCase } from "@/common/use-cases";
import { DatabaseServices } from "@/database/di-register";
import { AuthServices } from "@/domains/auth/di-register";
import { UserIdentity } from "@/domains/auth/entities";
import { PrismaClient } from "@prisma/client";
import { Chatbot } from "@/domains/messages/use-cases/chatbot";
import { IProviderConfigChatbotFlow } from "../../../messages/use-cases/chatbot/base";


export class UpdateChatbotStatus implements UseCase<UpdateChatbotStatusInput, void> {

    private readonly _user: UserIdentity;
    private readonly _db: PrismaClient;


    constructor({ user, prismaClient }: AuthServices & DatabaseServices) {

        this._user = user;
        this._db = prismaClient;
    }

    public async execute(input: UpdateChatbotStatusInput): Promise<void> {

        const provider = await this._db.provider.findFirst({
            where: {
                id: input.providerId,
                accountId: this._user.accountId
            },
            select: {
                id: true,
                config: true
            }
        });

        if (!provider)
            throw new AppError('Provider not found');

        const config = JSON.parse(provider.config ?? '{}') as IProviderConfigChatbotFlow ?? {};
        config.chatbotActive = input.active;

        await this._db.provider.update({
            where: { id: provider.id },
            data: {
                config: JSON.stringify(config)
            }
        });

        if (!config.chatbotActive)
            Chatbot.clearFromProvider(provider.id);
    }

}

export interface UpdateChatbotStatusInput {
    providerId: number;
    active?: boolean;
}
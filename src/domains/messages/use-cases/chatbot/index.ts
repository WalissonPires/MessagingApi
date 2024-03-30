import { existsSync, readFileSync } from "fs";
import { lookup } from "mime-types";
import { PrismaClient } from "@prisma/client";
import { diContainer } from "@fastify/awilix";
import { UseCase } from "../../../../common/use-cases";
import { MessageReceivedContext, Status } from "../../services/messaging";
import { DatabaseServices } from "../../../../database/di-register";
import { AppError } from "../../../../common/errors/app-error";
import { ChatBotStateMachine, ChatNode, injectExitNode } from "../../utils/chatbot";
import { MessagingFactory } from "../../services/messaging/factory";
import { MessagesServices } from "../../di-register";
import { ProviderType } from "../../../providers/entities/provider";

export class Chatbot implements UseCase<MessageReceivedContext, void> {

    private readonly _db: PrismaClient;
    private _messagingFactory: MessagingFactory;

    constructor({ prismaClient, messagingFactory }: DatabaseServices & MessagesServices) {

        this._db = prismaClient;
        this._messagingFactory = messagingFactory;
    }

    public async execute(input: MessageReceivedContext): Promise<void> {

        let contactContext = Chatbot._contactsChat[input.message.from];
        if (!contactContext) {

            const provider = await this._db.provider.findFirst({
                where: {
                    id: input.providerId
                },
                select: {
                    id: true,
                    type: true,
                    accountId: true,
                    config: true
                }
            });

            if (!provider)
                throw new AppError('Provider not found');

            if (!provider.config)
                return;

            const config = JSON.parse(provider.config);
            const chatbotRootNode = config?.chatbotMessages as ChatNode;

            if (!chatbotRootNode)
                return;

            injectExitNode(chatbotRootNode, '^sair$', 'Obrigado pelo contato. Se precisar de qualquer coisa, estamos à disposição!');

            contactContext = {
                accountId: provider.accountId,
                providerId: provider.id,
                providerType: provider.type as ProviderType,
                chatbot: new ChatBotStateMachine(chatbotRootNode, null),
                lastMessage: null
            };

            Chatbot._contactsChat[input.message.from] = contactContext;
        }

        const { chatbot, providerId, providerType } = contactContext;

        const service = this._messagingFactory.getService({ providerId: providerId, providerType: providerType as ProviderType });

        // const { status } = await service.getState();
        // if (status !== Status.Ready)
        //     return;

        if (chatbot.isEnded()) chatbot.reset();

        const stateChanged = chatbot.next({
            input: input.message.content
        });

        const state = chatbot.currentState();
        if (!state)
            return;

        contactContext.lastMessage = new Date();
        const replyMsgs = stateChanged ? state.output : state.invalidOutput ?? [];

        for(const replyMsg of replyMsgs) {

            if (replyMsg.startsWith('file://')) {

                const filename = replyMsg.replace('file://', '');
                if (!existsSync(filename))
                    continue;

                const file = readFileSync(filename);

                await service.sendMessage({
                    to: input.message.from,
                    content: '',
                    medias: [{
                        mimeType: lookup(filename) || 'application/octet-stream',
                        fileBase64: file.toString('base64')
                    }]
                });
            }
            else {
                await service.sendMessage({
                    to: input.message.from,
                    content: replyMsg
                });
            }
        }
    }


    private static _contactsChat: Record<string, ContactContext> = {};

    public static async handlerMessageReceived(context: MessageReceivedContext) {

        const { chatbot } = diContainer.cradle;

        await chatbot.execute(context);
    }

    public static clearFromProvider(providerId: number) {

        for(const key in this._contactsChat) {

            const meta = this._contactsChat[key];
            if (meta.providerId === providerId)
                delete this._contactsChat[key];
        }
    }
}

interface ContactContext {
    accountId: number;
    providerId: number;
    providerType: ProviderType;
    chatbot: ChatBotStateMachine;
    lastMessage: Date | null;
}
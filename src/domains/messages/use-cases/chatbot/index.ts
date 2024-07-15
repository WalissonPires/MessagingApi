import { existsSync, readFileSync } from "fs";
import { lookup } from "mime-types";
import { PrismaClient } from "@prisma/client";
import { diContainer } from "@fastify/awilix";
import { UseCase } from "../../../../common/use-cases";
import { MessageReceivedContext, MessegingService, MimeTypeMdiaLink } from "../../services/messaging";
import { DatabaseServices } from "../../../../database/di-register";
import { AppError } from "../../../../common/errors/app-error";
import { ChatBotStateMachine, ChatNode, ChatNodeOutput, ChatNodeOutputType, ChatNodePatternType, injectExitNode } from "../../utils/chatbot";
import { MessagingFactory } from "../../services/messaging/factory";
import { MessagesServices } from "../../di-register";
import { ProviderType } from "../../../providers/entities/provider";
import { IProviderConfigChatbotFlow } from "./base";

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

            const config = JSON.parse(provider.config) as IProviderConfigChatbotFlow;
            const chatbotRootNode = config?.chatbotMessages;

            if (!chatbotRootNode)
                return;

            injectExitNode(chatbotRootNode, ChatNodePatternType.Regex, '^sair$', 'Obrigado pelo contato. Se precisar de qualquer coisa, estamos à disposição!');

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

        const previousState = chatbot.currentState();

        if (previousState) {

            if (previousState.delay && contactContext.lastMessage) {

                const delayAt = new Date(contactContext.lastMessage?.getTime() + (1000 * previousState.delay));
                if (delayAt > new Date())
                    return;
            }
        }

        if (chatbot.isEnded()) chatbot.reset();

        const { changed } = chatbot.next({
            input: input.message.content
        });

        const state = chatbot.currentState();
        if (!state)
            return;

        contactContext.lastMessage = new Date();
        const replyMsgs = changed ? state.output : state.invalidOutput ?? [];

        for(const replyMsg of replyMsgs) {

            if (replyMsg.content.startsWith('file://')) {

                const filename = replyMsg.content.replace('file://', '');
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
            else if (replyMsg.type === ChatNodeOutputType.mediaLink) {

                await service.sendMessage({
                    to: input.message.from,
                    content: '',
                    medias: [{
                        mimeType: MimeTypeMdiaLink,
                        fileBase64: replyMsg.content
                    }]
                });
            }
            else {
                await service.sendMessage({
                    to: input.message.from,
                    content: replyMsg.content
                });
            }
        }
    }


    private static _contactsChat: Record<string, ContactContext> = {};
    private static _providersListerning: Record<number, boolean> = {};

    public static async registerProviderListerner(providerId: number, service: MessegingService) {

        if (this._providersListerning[providerId])
            return;

        service.addListenerMessageReceived(Chatbot.handlerMessageReceived);

        this._providersListerning[providerId] = true;
    }

    private static async handlerMessageReceived(context: MessageReceivedContext) {

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
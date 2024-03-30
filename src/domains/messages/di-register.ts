import { DIContainer } from "../../common/di-container";
import { MessagingFactory } from "./services/messaging/factory";
import { Chatbot } from "./use-cases/chatbot";
import { SendMessage } from "./use-cases/send-message";


export default function diRegister() {

    DIContainer.addScoped(MessagingFactory, 'messagingFactory');
    DIContainer.addScoped(SendMessage, 'sendMessage');
    DIContainer.addSingleton(Chatbot, 'chatbot');
}

export interface MessagesServices {
    messagingFactory: MessagingFactory;
    sendMessage: SendMessage;
    chatbot: Chatbot;
}
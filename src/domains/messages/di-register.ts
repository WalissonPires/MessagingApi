import { DIContainer } from "../../common/di-container";
import { MessagingFactory } from "./services/messaging/factory";


export default function diRegister() {

    DIContainer.addScoped(MessagingFactory, 'messagingFactory');
}

export interface MessagesServices {
    messagingFactory: MessagingFactory;
}
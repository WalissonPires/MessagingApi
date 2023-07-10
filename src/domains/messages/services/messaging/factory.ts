import { MessegingService } from ".";
import { WhatsAppService } from "../whatasapp";

export class MessagingFactory {

    public getService(options: MessegingFactoryOptions): MessegingService {

        return new WhatsAppService(options);
    }
}

export interface MessegingFactoryOptions {
    clientId: string;
}
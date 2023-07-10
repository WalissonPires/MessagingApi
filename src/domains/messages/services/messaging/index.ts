

export interface MessegingService {

    initialize(): Promise<void>;
    getState(): Promise<StatusResult>;
    sendMessage: (message: Message) => Promise<void>;

}

export interface Message {
    to: string;
    content: string;
}

export enum Status {
    None = 0,
    Uninitialized = 1,
    Initializing = 2,
    Ready = 3,
    Error = 4,


    // WhatsApp
    WaitQrCodeRead = 10
}

export interface StatusResult {
    status: Status;
    message?: string;
}
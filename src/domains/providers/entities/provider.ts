

export class Provider implements ProviderProps {

    id: number;
    accountId: number;
    type: ProviderType;
    name: string;
    status: ProviderStatus;
    createdAt: Date;
    updatedAt: Date;
    config: IProviderConfig | null;
    state: IProviderState | null;

    constructor(props: ProviderProps) {

        this.id = props.id;
        this.accountId = props.accountId;
        this.type = props.type;
        this.name = props.name;
        this.status = props.status;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.config = props.config;
        this.state = props.state;
    }

}

interface ProviderProps {
    id: number;
    accountId: number;
    type: ProviderType;
    name: string;
    status: ProviderStatus;
    createdAt: Date;
    updatedAt: Date;
    config: IProviderConfig | null;
    state: IProviderState | null;
}


export enum ProviderType {
    Email = 'email',
    Whatsapp = 'whatsapp',
    SMS = 'sms'
}

export enum ProviderStatus {
    Uninitialized = 'uninitialized',
    Initializing = 'initializing',
    Ready = 'ready',
    Error = 'error',
    AuthQRCode = 'auth-qrcode'
}

export interface IProviderConfig { }

export interface IProviderState { }
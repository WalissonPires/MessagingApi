import { ProviderType } from "../../entities/provider";


export interface CreateProviderInput {
    provider: ProviderModel;
}

interface ProviderModel {
    name: string;
    type: ProviderType;
    config: ProviderWhatsAppConfigModel | ProviderEmailSmtpConfigModel;
}

interface ProviderWhatsAppConfigModel {}

interface ProviderEmailSmtpConfigModel {
    host: string;
    port: number;
    enableSsl: boolean;
    email: string;
    password: string;
}
import { IProviderConfig } from "./provider";

export interface IWhatsAppProviderConfig extends IProviderConfig {
    phone: string;
}

export function isIWhatsAppProviderConfig(config: IProviderConfig): config is IWhatsAppProviderConfig {

    return !!(config as IWhatsAppProviderConfig).phone;
}
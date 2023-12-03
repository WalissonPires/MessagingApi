import { IProviderConfig } from "./provider";

export interface IEmailProviderConfig extends IProviderConfig {
    host: string;
    port: number;
    enableSsl: boolean;
    email: string;
    password: string;
}

export function isIEmailProviderConfig(config: IProviderConfig): config is IEmailProviderConfig {

    return !!(config as IEmailProviderConfig).host;
}
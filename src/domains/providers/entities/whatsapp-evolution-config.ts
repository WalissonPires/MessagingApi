import { IProviderConfig } from "./provider";

export interface IWhatsappEvolutionConfig extends IProviderConfig {
    apiUrl: string;
    token: string;
    instanceName: string;
}

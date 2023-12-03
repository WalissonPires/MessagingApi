import { Provider as ProviderDb } from "@prisma/client";
import { Provider, ProviderStatus, ProviderType } from "../entities/provider";


export class ProviderMapper {

    public static map(provider: ProviderDb): Provider {

        return new Provider({
            id: provider.id,
            type: provider.type as ProviderType,
            accountId: provider.id,
            name: provider.name,
            status: provider.status as ProviderStatus,
            createdAt: provider.createdAt,
            updatedAt: provider.updatedAt,
            config: provider.config ? JSON.parse(provider.config) : null,
            state: provider.state ? JSON.parse(provider.state) : null,
        });
    }
}
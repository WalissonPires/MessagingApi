import { PrismaClient } from "@prisma/client";
import { DatabaseServices } from "../../../database/di-register";
import { Provider } from "../entities/provider";
import { ProvidersRepository } from "./providers-repository";


export class ProvidersPrismaRepository implements ProvidersRepository {

    private readonly _db: PrismaClient;

    constructor({ prismaClient }: DatabaseServices) {

        this._db = prismaClient;
    }

    public async insert(provider: Provider): Promise<void> {

        const result = await this._db.provider.create({
            data: {
                name: provider.name,
                type: provider.type,
                status: provider.status,
                config: provider.config ? JSON.stringify(provider.config) : null,
                account:  {
                    connect: {
                        id: provider.accountId
                    }
                },
            }
        });

        provider.id = result.id;
    }

    public async update(provider: Provider): Promise<void> {

        await this._db.provider.update({
            where: {
                id: provider.id
            },
            data: {
                name: provider.name,
                type: provider.type,
                status: provider.status,
                config: provider.config ? JSON.stringify(provider.config) : null,
            }
        });
    }
}
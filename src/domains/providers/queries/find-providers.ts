import { PrismaClient } from "@prisma/client";
import { DatabaseServices } from "../../../database/di-register";
import { IQuery } from "../../../common/queries";
import { UserIdentity } from "../../auth/entities";
import { AuthServices } from "../../auth/di-register";
import { Provider } from "../entities/provider";
import { ProviderMapper } from "./provider-mapper";


export class FindProviders implements IQuery<FindProvidersInput, Provider[]> {

    private readonly _user: UserIdentity;
    private readonly _db: PrismaClient;

    constructor({ user, prismaClient }: AuthServices & DatabaseServices) {

        this._user = user;
        this._db = prismaClient;
    }

    public async execute(input: FindProvidersInput): Promise<Provider[]> {

        const providersDb = await this._db.provider.findMany({
            where: {
                accountId: this._user.accountId,
                name: {
                    contains: input.name,
                    mode: 'insensitive'
                }
            }
        });

        const providers = providersDb.map(p => ProviderMapper.map(p));
        return providers;
    }

}

export interface FindProvidersInput {
    name?: string
}
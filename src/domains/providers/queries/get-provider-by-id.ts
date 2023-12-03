import { PrismaClient } from "@prisma/client";
import { DatabaseServices } from "../../../database/di-register";
import { IQuery } from "../../../common/queries";
import { UserIdentity } from "../../auth/entities";
import { AuthServices } from "../../auth/di-register";
import { Provider } from "../entities/provider";
import { ProviderMapper } from "./provider-mapper";


export class GetProviderById implements IQuery<GetProviderByIdInput, Provider | null> {

    private readonly _user: UserIdentity;
    private readonly _db: PrismaClient;

    constructor({ user, prismaClient }: AuthServices & DatabaseServices) {

        this._user = user;
        this._db = prismaClient;
    }

    public async execute(input: GetProviderByIdInput): Promise<Provider | null> {

        const providerDb = await this._db.provider.findFirst({
            where: {
                id: input.providerId
            }
        });

        if (!providerDb || providerDb.accountId !== this._user.accountId) return null;

        return ProviderMapper.map(providerDb);
    }

}

export interface GetProviderByIdInput {
    providerId: number;
}
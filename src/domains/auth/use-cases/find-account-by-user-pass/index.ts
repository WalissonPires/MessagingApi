import { Hash } from "@/common/crypto/hash";
import { UseCase } from "@/common/use-cases";
import { DatabaseServices } from "@/database/di-register";


export class FindAccountByUserPass implements UseCase<FindAccountByUserPassInput, FindAccountByUserPassResult | null> {

    private readonly _db: DatabaseServices['prismaClient'];

    constructor({ prismaClient }: DatabaseServices) {

        this._db = prismaClient;
    }

    public async execute(input: FindAccountByUserPassInput): Promise<FindAccountByUserPassResult | null> {

        const passwordHash = Hash.generateSha256(input.password);

        const account = await this._db.account.findFirst({
            where: {
                username: input.username,
                password: passwordHash
            }
        });

        if (!account)
            return null;

        return {
            accountId: account.id
        };
    }

}

export interface FindAccountByUserPassInput {
    username: string;
    password: string;
}

export interface FindAccountByUserPassResult {
    accountId: number;
}
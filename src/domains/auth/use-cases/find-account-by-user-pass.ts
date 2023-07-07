import { UseCase } from "../../../common/use-cases";
import { DatabaseServices } from "../../../database/di-register";


export class FindAccountByUserPass implements UseCase<FindAccountByUserPassInput, FindAccountByUserPassResult | null> {

    private readonly _db: DatabaseServices['prismaClient'];

    constructor({ prismaClient }: DatabaseServices) {

        this._db = prismaClient;
    }

    public async execute(input: FindAccountByUserPassInput): Promise<FindAccountByUserPassResult | null> {

        const account = await this._db.account.findFirst({
            where: {
                username: input.username,
                password: input.password
            }
        });

        if (!account)
            return null;

        return {
            accountId: account.id
        };
    }

}

export class FindAccountByUserPassInput {
    username: string;
    password: string;
}

export class FindAccountByUserPassResult {
    accountId: number;
}
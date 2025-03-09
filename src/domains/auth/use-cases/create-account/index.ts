import { Hash } from "@/common/crypto/hash";
import { AppError } from "@/common/errors/app-error";
import { UseCase } from "@/common/use-cases";
import { DatabaseServices } from "@/database/di-register";
import { AppConfig } from "@/common/config";
import { CreateAccountValidator } from "./validator";
import { CreateAccountInput } from "./models";


export class CreateAccount implements UseCase<CreateAccountInput, void> {

    private readonly _db: DatabaseServices['prismaClient'];

    constructor({ prismaClient }: DatabaseServices) {

        this._db = prismaClient;
    }

    public async execute(input: CreateAccountInput): Promise<void> {

        const config = new AppConfig();
        const registerCode = config.registerCode();

        if (!registerCode)
            throw new AppError('Account registration is disabled');

        const { account } = new CreateAccountValidator().getValidOrThrowError(input);

        if (registerCode !== input.registerCode)
            throw new AppError('Invalid register code');

        const accountExists = await this._db.account.findFirst({
            select: { id: true },
            where: {
                username: account.username,
            }
        });

        if (accountExists)
            throw new AppError('Username already exists');

        const passwordHash = Hash.generateSha256(account.password);

        await this._db.account.create({
            data: {
                name: account.name,
                username: account.username,
                password: passwordHash,
            }
        });
    }
}
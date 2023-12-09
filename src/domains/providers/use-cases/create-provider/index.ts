import { AppError } from "@/common/errors/app-error";
import { UseCase } from "@/common/use-cases";
import { AuthServices } from "@/domains/auth/di-register";
import { UserIdentity } from "@/domains/auth/entities";
import { ProviderServices } from "../../di-register";
import { Provider, ProviderStatus, ProviderType } from "../../entities/provider";
import { ProvidersRepository } from "../../repositories/providers-repository";
import { CreateProviderValidator } from "./validator";
import { CreateProviderInput } from "./models";
import { IEmailProviderConfig, isIEmailProviderConfig } from "../../entities/email-provider";

export class CreateProvider implements UseCase<CreateProviderInput, Provider> {

    private readonly _user: UserIdentity;
    private readonly _providersRepo: ProvidersRepository;

    constructor({ user, providersRepository }: ProviderServices & AuthServices) {

        this._user = user;
        this._providersRepo = providersRepository;
    }

    public async execute(input: CreateProviderInput): Promise<Provider> {

        input = this.validate(input);

        const provider = this.createProviderFromInput(input);

        await this._providersRepo.insert(provider);

        return provider;
    }

    private validate(input: CreateProviderInput) {

        const result = new CreateProviderValidator().validate(input);

        if (!result.success)
            throw new AppError(AppError.InvalidFieldsMessage, result.errors);

        return result.data!;
    }

    private createProviderFromInput(input: CreateProviderInput) {

        const provider = new Provider({
            id: 0,
            accountId: this._user.accountId,
            name: input.provider.name,
            type: input.provider.type,
            status: ProviderStatus.Uninitialized,
            createdAt: new Date(),
            updatedAt: new Date(),
            config: null,
            state: null
        });


        switch(input.provider.type) {

            case ProviderType.Whatsapp:

                provider.config = {};
            break;

            case ProviderType.Email:

                if (!isIEmailProviderConfig(input.provider.config))
                    throw new AppError('invalid config');

                const inputEmailConfig = input.provider.config;
                const emailConfig: IEmailProviderConfig = {
                    host: inputEmailConfig.host,
                    port: inputEmailConfig.port,
                    enableSsl: inputEmailConfig.enableSsl,
                    email: inputEmailConfig.email,
                    password: inputEmailConfig.password
                };

                provider.config = emailConfig;
            break;

            default:
                throw new AppError('Provider type not supported: ' + input.provider.type);
        }

        return provider;
    }
}

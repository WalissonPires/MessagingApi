import { DIContainer } from "../../common/di-container";
import { FindProviders } from "./queries/find-providers";
import { GetProviderById } from "./queries/get-provider-by-id";
import { ProvidersPrismaRepository } from "./repositories/providers-prisma-repository";
import { ProvidersRepository } from "./repositories/providers-repository";
import { CreateProvider } from "./use-cases/create-provider";
import { InitProvider } from "./use-cases/init-provider";
import { GetProvidersStatus } from "./use-cases/providers-status";


export default function diRegister() {

    DIContainer.addScoped(ProvidersPrismaRepository, 'providersRepository');
    DIContainer.addScoped(GetProviderById, "getProviderById");
    DIContainer.addScoped(FindProviders, "findProviders");
    DIContainer.addScoped(CreateProvider, 'createProvider');
    DIContainer.addScoped(InitProvider, 'initProvider');
    DIContainer.addScoped(GetProvidersStatus, 'getProvidersStatus');
}

export interface ProviderServices {
    providersRepository: ProvidersRepository;

    getProviderById: GetProviderById;
    findProviders: FindProviders;

    createProvider: CreateProvider;
    initProvider: InitProvider;
    getProvidersStatus: GetProvidersStatus;
}
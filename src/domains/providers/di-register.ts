import { DIContainer } from "../../common/di-container";
import { FindProviders } from "./queries/find-providers";
import { GetProviderById } from "./queries/get-provider-by-id";
import { ProvidersPrismaRepository } from "./repositories/providers-prisma-repository";
import { ProvidersRepository } from "./repositories/providers-repository";
import { CreateProvider } from "./use-cases/create-provider";
import { InitProvider } from "./use-cases/init-provider";
import { FinalizeProvider } from "./use-cases/finalize-provider";
import { GetProvidersStatus } from "./use-cases/providers-status";
import { GetProviderChatbotFlow } from "./use-cases/get-provider-chatbot-flow";
import { UpdateProviderChatbotFlow } from "./use-cases/update-provider-chatbot-flow";
import { GetChatbotStatus } from "./use-cases/get-chatbot-status";
import { UpdateChatbotStatus } from "./use-cases/update-chatbot-status";


export default function diRegister() {

    DIContainer.addScoped(ProvidersPrismaRepository, 'providersRepository');
    DIContainer.addScoped(GetProviderById, "getProviderById");
    DIContainer.addScoped(FindProviders, "findProviders");
    DIContainer.addScoped(CreateProvider, 'createProvider');
    DIContainer.addScoped(InitProvider, 'initProvider');
    DIContainer.addScoped(FinalizeProvider, 'finalizeProvider');
    DIContainer.addScoped(GetProvidersStatus, 'getProvidersStatus');
    DIContainer.addScoped(GetProviderChatbotFlow, 'getProviderChatbotFlow');
    DIContainer.addScoped(UpdateProviderChatbotFlow, 'updateProviderChatbotFlow');
    DIContainer.addScoped(GetChatbotStatus, 'getChatbotStatus');
    DIContainer.addScoped(UpdateChatbotStatus, 'setChatbotStatus');
}

export interface ProviderServices {
    providersRepository: ProvidersRepository;

    getProviderById: GetProviderById;
    findProviders: FindProviders;

    createProvider: CreateProvider;
    initProvider: InitProvider;
    finalizeProvider: FinalizeProvider;
    getProvidersStatus: GetProvidersStatus;
    getProviderChatbotFlow: GetProviderChatbotFlow;
    updateProviderChatbotFlow: UpdateProviderChatbotFlow;
    getChatbotStatus: GetChatbotStatus;
    setChatbotStatus: UpdateChatbotStatus;
}
import { AppError } from "../../../../common/errors/app-error";
import { UseCase } from "../../../../common/use-cases";
import { MessagesServices } from "../../../messages/di-register";
import { MessegingServiceUtils, Status } from "../../../messages/services/messaging";
import { MessagingFactory } from "../../../messages/services/messaging/factory";
import { ProviderServices } from "../../di-register";
import { Provider, ProviderStatus } from "../../entities/provider";
import { FindProviders } from "../../queries/find-providers";
import { GetProviderById } from "../../queries/get-provider-by-id";
import { ProviderStatusUtils } from "../../utils/ProviderStatusUtils";


export class GetProvidersStatus implements UseCase<GetProvidersStatusInput, ProvidersStatus[]> {

    private _findProviders: FindProviders;
    private _getProviderById: GetProviderById;
    private _messagingFactory: MessagingFactory;

    constructor({ findProviders, getProviderById, messagingFactory }: ProviderServices & MessagesServices) {

        this._findProviders = findProviders;
        this._getProviderById = getProviderById;
        this._messagingFactory = messagingFactory;
    }

    public async execute(input: GetProvidersStatusInput): Promise<ProvidersStatus[]> {

        const providersStatus: ProvidersStatus[] = [];
        let providers: Provider[];

        if (input.providerId) {

            const provider = await this._getProviderById.execute({ providerId: input.providerId });
            if (!provider)
                throw new AppError('Provider not found');

            providers = [ provider ];
        }
        else
            providers = await this._findProviders.execute({});

        for(const provider of providers) {

            const service = this._messagingFactory.getService({
                providerId: provider.id,
                providerType: provider.type,
                config: provider.config
            });
            const state = await service.getState();

            const providerStatus: ProvidersStatus = {
                id: provider.id,
                name: provider.name,
                type: provider.type,
                status: ProviderStatusUtils.mapStatus(state.status),
                message: state.message
            };

            let a: ProviderStatus;

            if (state.status === Status.WaitQrCodeRead && MessegingServiceUtils.IsAuthQrCode(service)) {

                const { qrCodeContent } = await service.getQrCode();
                providerStatus.qrCodeContent = qrCodeContent;
            }

            providersStatus.push(providerStatus);
        }

        return providersStatus;
    }

}

export interface GetProvidersStatusInput {
    providerId?: number;
}

export interface ProvidersStatus {
    id: number;
    name: string;
    type: string;
    status: ProviderStatus;
    message?: string;
    qrCodeContent?: string;
}
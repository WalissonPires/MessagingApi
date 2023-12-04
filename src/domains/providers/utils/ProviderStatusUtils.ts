import { Status } from "../../messages/services/messaging";
import { ProviderStatus } from "../entities/provider";


export class ProviderStatusUtils {

    public static mapStatus(status: Status): ProviderStatus {

        const statusMap: Record<Status, ProviderStatus> = {
            [Status.None]: ProviderStatus.Uninitialized,
            [Status.Uninitialized]: ProviderStatus.Uninitialized,
            [Status.Initializing]: ProviderStatus.Initializing,
            [Status.Ready]: ProviderStatus.Ready,
            [Status.WaitQrCodeRead]: ProviderStatus.AuthQRCode,
            [Status.Error]: ProviderStatus.Error
        };

        return statusMap[status];
    }
}
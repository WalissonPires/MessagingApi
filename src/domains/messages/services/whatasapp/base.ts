import { MessegingService } from "../messaging";


export interface IWhatsAppService extends MessegingService {

    getQrCode(): Promise<QrCodeResult>;
}

export interface QrCodeResult {
    qrCodeContent: string;
}

export class IWhatsAppServiceUtils {
    public static IsWPService(service: MessegingService): service is IWhatsAppService {

        return typeof (service as IWhatsAppService).getQrCode === 'function';
    }
}
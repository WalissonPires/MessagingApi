import { AppConfig } from "@/common/config";
import { AppError } from "@/common/errors/app-error";
import { UseCase } from "@/common/use-cases";
import { UserIdentity } from "@/domains/auth/entities";
import { GetProviderById } from "../../queries/get-provider-by-id";
import { AuthServices } from "@/domains/auth/di-register";
import { ProviderServices } from "../../di-register";
import { MessagingFactory } from "@/domains/messages/services/messaging/factory";
import { MessagesServices } from "@/domains/messages/di-register";
import { MessegingServiceReceiverUtils } from "@/domains/messages/services/messaging";
import { Chatbot } from "@/domains/messages/use-cases/chatbot";

export class HandleProviderWebhook implements UseCase<HandleProviderWebhookInput, void> {

  private readonly _user: UserIdentity;
  private readonly _getProviderById: GetProviderById;
  private readonly _messagingFactory: MessagingFactory;

  constructor({ user, getProviderById, messagingFactory }: AuthServices & ProviderServices & MessagesServices) {
    this._user = user;
    this._getProviderById = getProviderById;
    this._messagingFactory = messagingFactory;
  }

  public async execute(input: HandleProviderWebhookInput): Promise<void> {

    const config = new AppConfig();
    const webhookToken = config.webhookToken(); // [TODO] Gerar token único para cada provider e validar aqui

    if (input.token !== webhookToken)
      throw new AppError('Invalid token');

    if (!isFinite(input.accountId))
      throw new AppError('Invalid accountId');

    this._user.isAuthenticated = true;
    this._user.accountId = input.accountId;

    const provider = await this._getProviderById.execute({ providerId: input.providerId });

    if (!provider) {
      throw new AppError('Provider not found');
    }

    const service = this._messagingFactory.getService({
      providerId: provider.id,
      providerType: provider.type,
      config: provider.config
    });

    if (MessegingServiceReceiverUtils.IsReceiver(service)) {
      await Chatbot.registerProviderListerner(provider.id, service, true);
      await service.processMessage(input.payload);
    }
  }
}

export interface HandleProviderWebhookInput {
  token: string;
  accountId: number;
  providerId: number;
  payload: any;
}
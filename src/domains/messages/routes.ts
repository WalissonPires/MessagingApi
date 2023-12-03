import { FastifyInstance } from "fastify";
import { IWhatsAppServiceUtils } from "./services/whatasapp/base";
import { AppError } from "../../common/errors/app-error";
import { Status } from "./services/messaging";

export default function (fastify: FastifyInstance) {

    fastify.get('/messages/status', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { messagingFactory, user } = request.diScope.cradle;

        const service = messagingFactory.getService({ clientId: 'account-' + user.accountId });
        const result = await service.getState();

        const serviceStatus: ServiceStatus = {
            id: 1,
            name: 'whatsapp for <number>',
            type: 'whatsapp',
            status: result.status,
            message: result.message
        };

        if (result.status === Status.WaitQrCodeRead && IWhatsAppServiceUtils.IsWPService(service)) {

            const { qrCodeContent } = await service.getQrCode();
            serviceStatus.qrCodeContent = qrCodeContent;
        }


        return [ serviceStatus ];
    });

    fastify.post('/messages/init', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { messagingFactory, user } = request.diScope.cradle;

        const service = messagingFactory.getService({ clientId: 'account-' + user.accountId });
        await service.initialize();

        reply.status(204);
    });

    fastify.get('/messages/qrcode', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { messagingFactory, user } = request.diScope.cradle;

        const service = messagingFactory.getService({ clientId: 'account-' + user.accountId });

        if (!IWhatsAppServiceUtils.IsWPService(service))
            throw new AppError('Endpoint not suported for service');

        const result = await service.getQrCode();
        return result;
    });

    fastify.post<{ Body: PostMessageModel }>('/messages', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { messagingFactory, user } = request.diScope.cradle;

        const { to, content } = request.body;
        const service = messagingFactory.getService({ clientId: 'account-' + user.accountId });

        await service.sendMessage({
            to,
            content
        });
    });
}

interface PostMessageModel {
    to: string;
    content: string;
}

interface ServiceStatus {
    id: number;
    name: string;
    type: string;
    status: Status;
    message?: string;
    qrCodeContent?: string;
}
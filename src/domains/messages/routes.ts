import { FastifyInstance } from "fastify";
import { IWhatsAppServiceUtils } from "./services/whatasapp/base";
import { AppError } from "../../common/errors/app-error";

export default function (fastify: FastifyInstance) {

    fastify.get('/messeges/status', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { messagingFactory, user } = request.diScope.cradle;

        const service = messagingFactory.getService({ clientId: 'account-' + user.accountId });
        const result = await service.getState();

        return [{
            id: 1,
            name: 'whatsapp for <number>',
            type: 'whatsapp',
            status: result.status,
            message: result.message
        }];
    });

    fastify.post('/messeges/init', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { messagingFactory } = request.diScope.cradle;
        const { user } = request;

        const service = messagingFactory.getService({ clientId: 'account-' + user.accountId });
        await service.initialize();

        reply.status(204);
    });

    fastify.get('/messeges/qrcode', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

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
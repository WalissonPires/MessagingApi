import { FastifyInstance } from "fastify";
import { CreateProviderInput } from "./use-cases/create-provider/models";
import { UpdateProviderChatbotFlowInput } from "./use-cases/update-provider-chatbot-flow";
import { UpdateChatbotStatusInput } from "./use-cases/update-chatbot-status";

export default function (fastify: FastifyInstance) {

    fastify.post<{ Body: CreateProviderInput }>('/providers', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { createProvider } = request.diScope.cradle;

        const result = await createProvider.execute(request.body);

        return result;
    });

    fastify.get<{ Params: { providerId: string } }>('/providers/:providerId', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { getProviderById } = request.diScope.cradle;

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;

        const result = await getProviderById.execute({ providerId });
        return result;
    });

    fastify.get<{ Querystring: { name?: string } }>('/providers', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { findProviders } = request.diScope.cradle;

        const result = await findProviders.execute({
            name: request.query.name
        });

        return result;
    });

    fastify.get<{ Params: { providerId: string } }>('/providers/status/:providerId?', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId: number | undefined = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : undefined;

        const { getProvidersStatus } = request.diScope.cradle;

        const result = await getProvidersStatus.execute({
            providerId
        });

        return result;
    });

    fastify.post<{ Params: { providerId: string } }>('/providers/:providerId/init', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;

        const { initProvider } = request.diScope.cradle;

        await initProvider.execute({
            providerId
        });

        reply.status(204);
    });

    fastify.post<{ Params: { providerId: string } }>('/providers/:providerId/finalize', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;

        const { finalizeProvider } = request.diScope.cradle;

        await finalizeProvider.execute({
            providerId
        });

        reply.status(204);
    });

    fastify.get<{ Params: { providerId: string } }>('/providers/:providerId/chatbot-flow', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;

        const { getProviderChatbotFlow } = request.diScope.cradle;

        const result = await getProviderChatbotFlow.execute({
            providerId
        });

        return result;
    });

    fastify.put<{ Params: { providerId: string },  Body: UpdateProviderChatbotFlowInput }>('/providers/:providerId/chatbot-flow', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;
        request.body.providerId = providerId;

        const { updateProviderChatbotFlow } = request.diScope.cradle;

        await updateProviderChatbotFlow.execute(request.body);

        reply.status(204);
    });

    fastify.get<{ Params: { providerId: string } }>('/providers/:providerId/chatbot-status', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;

        const { getChatbotStatus } = request.diScope.cradle;

        const result = await getChatbotStatus.execute({
            providerId
        });

        return result;
    });

    fastify.put<{ Params: { providerId: string },  Body: UpdateChatbotStatusInput }>('/providers/:providerId/chatbot-status', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        let providerId = parseInt(request.params.providerId);
        providerId = isFinite(providerId) ? providerId : 0;
        request.body.providerId = providerId;

        const { setChatbotStatus } = request.diScope.cradle;

        await setChatbotStatus.execute(request.body);

        reply.status(204);
    });
}
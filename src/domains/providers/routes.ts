import { FastifyInstance } from "fastify";
import { CreateProviderInput } from "./use-cases/create-provider/models";

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
}
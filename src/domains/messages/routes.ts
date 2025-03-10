import { FastifyInstance } from "fastify";
import { Status } from "./services/messaging";

export default function (fastify: FastifyInstance) {

    fastify.post<{ Body: PostMessageModel }>('/messages', { onRequest: [ fastify.authenticate ] }, async (request, reply) => {

        const { sendMessage } = request.diScope.cradle;
        const result = await sendMessage.execute(request.body);

        return result;
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
import { AppError } from "../../common/errors/app-error";
import { AppServer } from "../../server/base";


export default function (fastify: AppServer) {

    fastify.post<{ Body: SignModel }>('/auth/sign', (request, reply) => {

        const { username, password } = request.body ?? {};

        const userMatch = /*username === 'test' &&*/ password === 'test';
        if (!userMatch)
            throw new AppError('Invalid user/password');

        const token = fastify.jwt.sign({
            userId: username
        });

        return { token };
    });

    fastify.get('/auth/me', { onRequest: [ fastify.authenticate ] }, (request, reply) => {

        const { user } = request.diScope.cradle;

        return {
            userId: user.userId
        };
    });
}

interface SignModel {
    username: string;
    password: string;
}
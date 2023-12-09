import { FastifyReply, FastifyRequest } from "fastify";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import jwt from "@fastify/jwt";
import cors from '@fastify/cors';
import { AppConfig } from "../common/config";
import { AppServer } from "./base";
import { AppError } from "../common/errors/app-error";
import { UserAuthenticate } from "../domains/auth/entities";

export default function registerPlugins(app: AppServer, config: AppConfig) {

    app.register(cors, {
        origin: '*'
    });

    app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true });

    app.addHook('preHandler', (request, reply, done) => {

        if (request.user) {

            const  { user } = request.diScope.cradle;
            user.isAuthenticated = true;
            user.accountId = (request.user as UserAuthenticate).accountId;
        }

        done();
    });

    registerAuth(app, config);
}

function registerAuth(app: AppServer, config: AppConfig) {

    const jwtSecret = config.jwtSecret();
    if (!jwtSecret)
        throw new AppError('JWT Secret is not configured');

    app.register(jwt, {
        secret: jwtSecret
    });

    app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {

        try {
            await request.jwtVerify();
        }
        catch (error) {

            const message: string = AppError.parse(error).message ?? '';

            if (message.startsWith('Authorization token is invalid') || message.startsWith('No Authorization was found'))
                error = new AppError('Authorization token is invalid');

            reply.send(error);
        }
    });
}
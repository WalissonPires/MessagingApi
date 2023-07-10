import { fastifyAwilixPlugin } from "@fastify/awilix";
import jwt from "@fastify/jwt";
import { AppConfig } from "../common/config";
import { AppServer } from "./base";
import { AppError } from "../common/errors/app-error";
import { UserAuthenticate } from "../domains/auth/entities";

export default function registerPlugins(app: AppServer, config: AppConfig) {

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

    app.register(jwt, {
        secret: config.jwtSecret()
    });

    app.decorate("authenticate", async (request, reply) => {

        try {
            await request.jwtVerify();
        }
        catch (error) {

            const message: string = error.message ?? '';

            if (message.startsWith('Authorization token is invalid') || message.startsWith('No Authorization was found'))
                error = new AppError('Authorization token is invalid');

            reply.send(error);
        }
    });
}
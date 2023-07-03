import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import { AppError } from "../common/errors/app-error";
import { AppConfig } from "../common/config";
import Fastify, { FastifyInstance } from "fastify";
import authRoutes from "../domains/auth/routes";
import { AppServer } from "./base";

export class Server {

    private _app: AppServer;

    constructor() {

        this.setup();

        authRoutes(this._app);
        this._app.get('/', () => ({ message: 'Is running v0.1.9' }));
    }

    public async listen() {

        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

        await this._app.listen({
            port,
            host: '::'                  // listen on all interfaces (Required by Fly.io)
        });

        console.log('Listen on http://127.0.0.1:' + port);
    }

    private setup() {

        const config = new AppConfig();

        this._app = Fastify({
            logger: config.enableFastifyLogger()
        }) as any;

        this.registerAuth(config);

        this._app.setErrorHandler(this.handleError.bind(this));

        this._app.get('/', () => ({ message: 'Is running v0.1.9' }));
    }

    private registerAuth(config: AppConfig) {

        this._app.register(jwt, {
            secret: config.jwtSecret()
        });

        this._app.decorate("authenticate", async (request, reply) => {

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


    private handleError(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {

        if (AppError.isThisType(error)) {

            reply.status(422).send({
                message: error.message
            });

            return;
        }

        this._app.log.error(error);

        reply.status(500).send({
            message: 'Internal Server Error'
        });
    }
}
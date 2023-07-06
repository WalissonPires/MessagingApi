import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../common/errors/app-error";
import { AppConfig } from "../common/config";
import { AppServer } from "./base";
import diRegisters from "./di-registers";
import registerRoutes from "./routes";
import registerPlugins from "./plugins";

export class Server {

    private _app: AppServer;

    constructor() {

        this.setup();

        diRegisters();
        registerRoutes(this._app);
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

        this._app.setErrorHandler(this.handleError.bind(this));

        this._app.get('/', () => ({ message: 'Is running v0.0.1' }));

        registerPlugins(this._app, config);
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
import Fastify, { FastifyInstance } from "fastify";

export class Server {

    private _app: FastifyInstance;

    constructor() {

        this._app = Fastify({
            logger: process.env.NODE_ENV === 'development'
        });

        this._app.get('/', () => ({ message: 'Is running v0.1.9' }));
    }

    public async listen() {

        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

        await this._app.listen({
            port
        });

        console.log('Listen on http://localhost:' + port);
    }
}
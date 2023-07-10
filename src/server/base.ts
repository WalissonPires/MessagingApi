import { FastifyInstance, onRequestHookHandler } from "fastify";


export interface AppServer extends FastifyInstance {

}

declare module 'fastify' {

    interface FastifyInstance {
        authenticate: onRequestHookHandler;
    }
}
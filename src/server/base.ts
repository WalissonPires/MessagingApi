import { FastifyInstance, onRequestHookHandler } from "fastify";


export interface AppServer extends FastifyInstance {

}

export interface UserAuthenticate {
    userId: string;
}

declare module 'fastify' {

    interface FastifyInstance {
        authenticate: onRequestHookHandler;
    }

    interface FastifyRequest {
        user: UserAuthenticate;
    }
}
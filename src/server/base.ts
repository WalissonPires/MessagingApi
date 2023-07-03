import { FastifyInstance, onRequestHookHandler } from "fastify";


export interface AppServer extends FastifyInstance {
    authenticate: onRequestHookHandler;
}

export interface UserAuthenticate {
    userId: string;
}
import { FastifyInstance, onRequestHookHandler } from "fastify";
import { UserAuthenticate } from "../domains/auth/entities";


export interface AppServer extends FastifyInstance {

}

declare module 'fastify' {

    interface FastifyInstance {
        authenticate: onRequestHookHandler;
    }

    interface FastifyRequest {
        user: UserAuthenticate;
    }
}
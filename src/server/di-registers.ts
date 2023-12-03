import databaseDIRegister, { DatabaseServices } from "../database/di-register";
import authDIRegister, { AuthServices } from "../domains/auth/di-register";
import providersDIRegister, { ProviderServices } from "../domains/providers/di-register";
import messagesDIRegister, { MessagesServices } from "../domains/messages/di-register";

export default function diRegisters() {

    databaseDIRegister();
    authDIRegister();
    providersDIRegister();
    messagesDIRegister();
}

interface Servies  extends
    DatabaseServices,
    AuthServices,
    MessagesServices,
    ProviderServices {}

declare module '@fastify/awilix' {

    interface Cradle extends Servies {

    }

    interface RequestCradle extends Servies {

    }
}
import databaseDIRegister, { DatabaseServices } from "../database/di-register";
import authDIRegister, { AuthServices } from "../domains/auth/di-register";
import providersDIRegister, { ProviderServices } from "../domains/providers/di-register";
import messagesDIRegister, { MessagesServices } from "../domains/messages/di-register";
import filesDIRegister, { FileServices } from "../domains/files/di-register";

export default function diRegisters() {

    databaseDIRegister();
    authDIRegister();
    providersDIRegister();
    messagesDIRegister();
    filesDIRegister();
}

interface Servies  extends
    DatabaseServices,
    AuthServices,
    MessagesServices,
    ProviderServices,
    FileServices {}

declare module '@fastify/awilix' {

    interface Cradle extends Servies {

    }

    interface RequestCradle extends Servies {

    }
}
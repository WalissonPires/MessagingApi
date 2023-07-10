import databaseDIRegister, { DatabaseServices } from "../database/di-register";
import authDIRegister, { AuthServices } from "../domains/auth/di-register";
import messagesDIRegister, { MessagesServices } from "../domains/messages/di-register";

export default function diRegisters() {

    messagesDIRegister();
    databaseDIRegister();
    authDIRegister();
}

interface Servies  extends
    MessagesServices,
    AuthServices,
    DatabaseServices {}

declare module '@fastify/awilix' {

    interface Cradle extends Servies {

    }

    interface RequestCradle extends Servies {

    }
}
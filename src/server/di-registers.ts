import databaseDIRegister, { DatabaseServices } from "../database/di-register";
import authDIRegister, { AuthServices } from "../domains/auth/di-register";

export default function diRegisters() {

    databaseDIRegister();
    authDIRegister();
}

interface Servies  extends
    AuthServices,
    DatabaseServices {}

declare module '@fastify/awilix' {

    interface Cradle extends Servies {

    }

    interface RequestCradle extends Servies {

    }
}
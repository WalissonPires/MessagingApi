import databaseDIRegister, { DatabaseServices } from "../database/di-register";
import authDIRegister from "../domains/auth/di-register";

export default function diRegisters() {

    databaseDIRegister();
    authDIRegister();
}

interface Servies  extends
    DatabaseServices {}

declare module '@fastify/awilix' {

    interface Cradle extends Servies {

    }

    interface RequestCradle extends Servies {

    }
}
import { PrismaClient } from "@prisma/client";
import { DIContainer, ServiceType } from "../common/di-container";
import createPrismaClient from "./prisma-factory";

export default function diRegister() {

    DIContainer.addSingleton(createPrismaClient, 'prismaClient', ServiceType.Function);
}

export interface DatabaseServices {
    prismaClient: PrismaClient;
}
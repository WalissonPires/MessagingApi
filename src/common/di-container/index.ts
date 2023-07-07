import { diContainer } from "@fastify/awilix";
import { asClass, asFunction, Lifetime } from "awilix";

export abstract class DIContainer {

    public static addSingleton(classCtor: any, name: string, type: ServiceType = ServiceType.Class) {

        const as = DIContainer.getRegisterFunction(type);

        diContainer.register({
            [name]: as(classCtor, {
                lifetime: Lifetime.SINGLETON
            })
        });
    }

    public static addScoped(classCtor: any, name: string, type: ServiceType = ServiceType.Class) {

        const as = DIContainer.getRegisterFunction(type);

        diContainer.register({
            [name]: as(classCtor, {
                lifetime: Lifetime.SCOPED
            })
        });
    }

    private static getRegisterFunction(type: ServiceType) {

        const map = {
            [ServiceType.Class]: asClass,
            [ServiceType.Function]: asFunction,
            [ServiceType.Value]: asClass
        };

        return map[type];
    }
}

export enum ServiceType {
    Class = 1,
    Function = 2,
    Value = 3
}
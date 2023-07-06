import { diContainer } from "@fastify/awilix";
import { asClass, Lifetime }from "awilix";

export abstract class DIContainer {

    public static addSingleton(classCtor: any, name: string) {

        diContainer.register({
            [name]: asClass(classCtor, {
                lifetime: Lifetime.SINGLETON
            })
        });
    }

    public static addScoped(classCtor: any, name: string) {

        diContainer.register({
            [name]: asClass(classCtor, {
                lifetime: Lifetime.SCOPED
            })
        });
    }
}
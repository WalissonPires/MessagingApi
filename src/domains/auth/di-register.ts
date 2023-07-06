import { DIContainer } from "../../common/di-container";
import { UserIdentity } from "./entities";


export default function diRegister() {

    DIContainer.addScoped(UserIdentity, 'user');
}

declare module '@fastify/awilix' {

    interface Cradle {

    }

    interface RequestCradle {
        user: UserIdentity
    }
}
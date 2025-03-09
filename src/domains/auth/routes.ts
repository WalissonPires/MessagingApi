import { AppError } from "../../common/errors/app-error";
import { AppServer } from "../../server/base";
import { UserAuthenticate } from "./entities";
import { CreateAccountInput } from "./use-cases/create-account/models";

export default function (fastify: AppServer) {

    fastify.post<{ Body: SignModel }>('/auth/sign', async (request, reply) => {

        const { username, password } = request.body ?? {};
        const { findAccountByUserPass } = request.diScope.cradle;

        const account = await findAccountByUserPass.execute({ username, password });
        if (!account)
            throw new AppError('Invalid user/password');

        const payload: UserAuthenticate = {
            accountId: account.accountId
        };

        const token = fastify.jwt.sign(payload);

        return { token };
    });

    fastify.post<{ Body: CreateAccountInput }>('/auth/account', async (request, reply) => {

        const { createAccount } = request.diScope.cradle;
        await createAccount.execute(request.body);
    });

    fastify.get('/auth/me', { onRequest: [ fastify.authenticate ] }, (request, reply) => {

        const { user } = request.diScope.cradle;

        return {
            accountId: user.accountId
        };
    });
}

interface SignModel {
    username: string;
    password: string;
}
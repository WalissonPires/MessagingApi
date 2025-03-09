import { DIContainer } from "../../common/di-container";
import { UserIdentity } from "./entities";
import { CreateAccount } from "./use-cases/create-account";
import { FindAccountByUserPass } from "./use-cases/find-account-by-user-pass";


export default function diRegister() {

    DIContainer.addScoped(UserIdentity, 'user');
    DIContainer.addScoped(FindAccountByUserPass, 'findAccountByUserPass');
    DIContainer.addScoped(CreateAccount, 'createAccount');
}

export interface AuthServices {
    user: UserIdentity;
    findAccountByUserPass: FindAccountByUserPass;
    createAccount: CreateAccount;
}
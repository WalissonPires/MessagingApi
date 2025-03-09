export interface CreateAccountInput {
    registerCode: string;
    account: {
        name: string;
        username: string;
        password: string;
    }
}
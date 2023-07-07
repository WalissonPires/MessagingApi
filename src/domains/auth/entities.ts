
export class UserIdentity {
    public accountId: number = 0;
    public isAuthenticated: boolean = false;
}


export interface UserAuthenticate {
    accountId: number;
}
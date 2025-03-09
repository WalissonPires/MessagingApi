import { z } from 'zod';
import { ValidatorBase } from '@/common/validation/validator-base';
import { CreateAccountInput } from './models';

export class CreateAccountValidator extends ValidatorBase<CreateAccountInput> {

    protected getSchema() {

        return z.object({
            registerCode: z.string().max(30),
            account: z.object({
                name: z.string().max(60),
                username: z.string().max(60),
                password: z.string().min(8).max(30)
            })
        });
    }
}
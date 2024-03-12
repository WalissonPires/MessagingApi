import { z } from 'zod';
import { ValidationResult, Validator } from "../../../../common/validation";
import { ZodErrorMap } from '../../../../common/validation/zod';
import { SendMessageInput } from ".";


export class SendMessageValidator implements Validator<SendMessageInput> {

    public validate(input: SendMessageInput): ValidationResult<SendMessageInput> {

        const schema = z.object({
            to: z.string().max(60),
            content: z.string().max(1000),
            medias: z.array(z.object({
                mimeType: z.string().max(20),
                fileBase64: z.string(),
                label: z.string().max(100).optional()
            })).optional(),
            providers: z.array(z.object({
                id: z.number()
            })).optional()
        });

        const zodResult = schema.safeParse(input);

        if (zodResult.success)
            return { success: true, errors: {}, data: zodResult.data };

        return {
            success: false,
            errors: ZodErrorMap.map(zodResult.error)
        };
    }
}
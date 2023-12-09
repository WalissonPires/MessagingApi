import { z } from 'zod';
import { ValidationResult, Validator } from "../../../../common/validation";
import { ProviderType } from '../../entities/provider';
import { ZodErrorMap } from '../../../../common/validation/zod';
import { CreateProviderInput } from "./models";

export class CreateProviderValidator implements Validator<CreateProviderInput> {

    public validate(input: CreateProviderInput): ValidationResult<CreateProviderInput> {

        const baseSchema = {
            name: z.string().max(30),
            //type: z.nativeEnum(ProviderType)
        };

        const whatsappConfigSchema = {
            type: z.literal(ProviderType.Whatsapp),
            config: z.object({
                //phone: z.string().length(11)
            })
        };

        const emailConfigSchema = {
            type: z.literal(ProviderType.Email),
            config: z.object({
                host: z.string().max(50),
                port: z.number(),
                enableSsl: z.boolean(),
                email: z.string().email().max(100),
                password: z.string().max(60)
            })
        };

        const whatsappSchema = {
            ...baseSchema,
            ...whatsappConfigSchema
        };

        const emailSchema = {
            ...baseSchema,
            ...emailConfigSchema
        };

        const providerSchema = z.discriminatedUnion('type', [ z.object(whatsappSchema), z.object(emailSchema) ] );

        const schema = z.object({
            provider: providerSchema
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
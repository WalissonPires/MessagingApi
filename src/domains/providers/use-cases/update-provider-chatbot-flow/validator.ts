import { z } from 'zod';
import { ValidationResult, Validator } from "../../../../common/validation";
import { ZodErrorMap } from '../../../../common/validation/zod';
import { ChatNodeAction, ChatNodeOutputType } from '../../../messages/utils/chatbot';
import { UpdateProviderChatbotFlowInput } from '.';

export class UpdateProviderChatbotFlowValidador implements Validator<UpdateProviderChatbotFlowInput> {

    public validate(input: UpdateProviderChatbotFlowInput): ValidationResult<UpdateProviderChatbotFlowInput> {

        const nodeSchema = z.object({
            id: z.string(),
            label: z.string(),
            pattern: z.string(),
            invalidOutput:z.array(z.object({
                type: z.union([ z.literal(ChatNodeOutputType.text), z.literal(ChatNodeOutputType.mediaLink) ]),
                content: z.string()
            })).optional(),
            output: z.array(z.object({
                type: z.union([ z.literal(ChatNodeOutputType.text), z.literal(ChatNodeOutputType.mediaLink) ]),
                content: z.string()
            })),
            delayChildren: z.number().gt(0).optional(),
            delay: z.number().gt(0).optional(),
            action: z.object({
                type: z.nativeEnum(ChatNodeAction)
            }).optional()
        });

        type NodeSchema = z.infer<typeof nodeSchema> & {
            childs: NodeSchema[];
          };

        const nodeWithChildSchema: z.ZodType<NodeSchema> = nodeSchema.extend({
            childs: z.lazy(() => nodeWithChildSchema.array())
        });

        const schema = z.object({
            providerId: z.number(),
            chatbotFlow: nodeWithChildSchema
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
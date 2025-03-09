import { z } from "zod";
import { ValidationResult, Validator } from ".";
import { ZodErrorMap } from "./zod";
import { AppError } from "../errors/app-error";

export abstract class ValidatorBase<T> implements Validator<T> {

    public validate(input: T): ValidationResult<T> {

        const schema = this.getSchema();

        const zodResult = schema.safeParse(input);

        if (zodResult.success)
            return { success: true, errors: {}, data: zodResult.data };

        return {
            success: false,
            errors: ZodErrorMap.map(zodResult.error)
        };
    }

    public getValidOrThrowError(input: T): T {

        const result = this.validate(input);

        if (!result.success)
            throw new AppError(AppError.InvalidFieldsMessage, result.errors);

        return result.data!;
    }

    protected abstract getSchema(): z.ZodSchema<T>;
}
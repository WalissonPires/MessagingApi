import { ZodError } from "zod";


export class ZodErrorMap {

    public static map<T>(error: ZodError<T>) {

        return error.errors.reduce((result, error) => {

            const prop = error.path.join('.');
            result[prop] ||= [];
            result[prop].push(error.message);

            return result;

        }, {} as Record<string, string[]>)
    }
}
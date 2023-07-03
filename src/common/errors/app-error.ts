

export class AppError extends Error {

    public static isThisType(error: any): error is AppError {

        return error instanceof AppError;
    }
}
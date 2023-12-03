

export class AppError extends Error {

    public details: Record<string, string[]> = {};

    constructor(message: string, details:  Record<string, string[]> = {}) {
        super(message);
        this.details = details;
    }

    public static isThisType(error: any): error is AppError {

        return error instanceof AppError;
    }

    public static parse(error: any): AppError {

        if (AppError.isThisType(error))
            return error;

        const message = error?.message ?? 'Unknow error';

        const appError = new AppError(message);
        appError.cause = error;

        return appError;
    }

    public static readonly InvalidFieldsMessage = 'Invalid fields';
}
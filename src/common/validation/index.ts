
export interface Validator<T> {
    validate(entity: T): ValidationResult<T>;
}

export interface ValidationResult<T> {
    success: boolean;
    errors: Record<string, string[]>;
    data?: T;
}
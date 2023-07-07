

export interface UseCase<TInput, TResult> {
    execute(input: TInput): Promise<TResult>;
}
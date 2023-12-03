
export interface IQuery<TInput, TResult> {
    execute(input: TInput): Promise<TResult>;
}
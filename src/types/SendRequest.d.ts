export interface CommonReturn<T>
{
    code: number;
    message: string;
    data?: T;
}
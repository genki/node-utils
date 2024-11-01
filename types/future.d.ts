type OK<T> = (value: T) => void;
type NO = (e: any) => void;
export declare class Waitable<T> {
    ok: OK<T>;
    no: NO;
    protected _promise: Promise<T>;
    protected _done: boolean;
    constructor();
    reset(): void;
    wait<S>(done: (x: T) => S, yet?: () => void): Promise<S>;
    get done(): boolean;
    update(x: T): void;
}
export declare const waiter: <T, R, A extends any[]>(w: Waitable<T>, done: (x: T) => (...args: A) => Promise<R> | R) => (...args: A) => Promise<R>;
export declare const ready: <T extends {
    ready: Future<Required<T> & T>;
}>(x: T | undefined) => x is Required<T> & T;
export declare const readies: <T extends {
    ready: Future<Required<T> & T>;
}>(xs: (T | undefined)[]) => (Required<T> & T)[];
export declare class Future<T> extends Waitable<T> {
    protected taker?: (() => Promise<T> | T) | undefined;
    constructor(taker?: (() => Promise<T> | T) | undefined);
    then(ok?: OK<T>, no?: NO): Promise<void>;
    invalidate(): void;
    promise(): Promise<T>;
}
export {};

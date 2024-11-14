export declare const eqA: <A extends ArrayLike<T>, T>(a: A, b?: A) => boolean;
type CMP<T> = (a: T, b: T) => boolean;
export declare function same<A extends any[], K extends keyof A[number]>(this: CMP<A[0][K]> | void, key: K, ...a: A): boolean;
export {};

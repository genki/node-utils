export declare const eqA: <A extends ArrayLike<T>, T>(a: A, b?: A) => boolean;
type CMP<T> = (a: T, b: T) => boolean;
export declare function same<T>(this: CMP<T[typeof key]> | void, key: keyof T, ...a: T[]): boolean;
export {};

export declare const eqA: <A extends ArrayLike<T>, T>(a: A, b?: A) => boolean;
type CMP<T> = (a: T, b: T) => boolean;
export declare function same<A extends any[], K extends keyof A[number]>(this: CMP<A[0][K]> | void, key: K, ...a: A): boolean;
export declare const groupBy: <T extends Record<K, V>, K extends keyof T, V extends PropertyKey>(a: T[], key: K) => Record<T[K], T[]>;
export {};

import type { Defined, NotPromise } from "./types";
export declare const acmp: <T extends number>(a: ArrayLike<T>, b: ArrayLike<T>) => number;
export declare function Q<T>(): Q<T>;
export declare function Q<T, U = Defined<T>>(x: U | undefined | void, v: U): U;
export type Q<T> = T | undefined;
export type X<T> = Defined<T> & NotPromise<T>;
export declare const X: <T>(x: NotPromise<T> | undefined) => x is NotPromise<T>;
export type P<T> = Promise<T>;
export declare const P: <T>(x: T | Promise<T>) => x is Promise<T>;

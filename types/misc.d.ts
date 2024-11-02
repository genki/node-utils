import type { Defined, NotPromise } from "./types";
export declare const acmp: <T extends number>(a: ArrayLike<T>, b: ArrayLike<T>) => number;
export declare function Q<T>(): Q<T>;
export declare function Q<T, U = Defined<T>>(x: U | undefined): U | undefined;
export declare function Q<T, U = Defined<T>>(x: U | undefined | void, v: U): U;
export type Q<T> = T | undefined;
export type QX<T> = undefined extends T ? T : never;
export type X<T> = Defined<QX<T>> & NotPromise<QX<T>>;
export declare function X<T>(x: NotPromise<QX<T>>): x is NotPromise<QX<T>>;
export type P<T> = Promise<T>;
export declare const P: <T>(x: T | Promise<T>) => x is Promise<T>;
export declare const touch: (..._: any[]) => void;

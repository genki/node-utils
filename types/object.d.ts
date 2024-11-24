import type { DefinedKeys, PartialKeys } from "./types";
export declare const entries: <T extends Record<K, V>, K extends keyof T, V extends T[K]>(obj: T | PartialKeys<T>) => readonly [K, V][];
export declare const entriesX: <T extends Record<K, V>, K extends DefinedKeys<T>, V extends T[K], VX extends V extends undefined ? never : V>(obj: T | PartialKeys<T>) => readonly [K, VX][];
export declare const valuesOf: {
    <T extends Record<K, V>, K extends keyof T, V extends T[K]>(obj: T): V[];
    <T extends Record<K, V>, K extends keyof T, V extends T[K]>(obj: Partial<T>): V[];
};
export declare const keysOf: <T extends Record<K, V>, K extends keyof T, V extends T[K]>(obj: T | PartialKeys<T>) => K[];
export declare const keysOfX: <T extends Record<K, V>, K extends DefinedKeys<T>, V extends T[K]>(obj: T | PartialKeys<T>) => DefinedKeys<T>[];
export declare const compact: <T>(a: (T | undefined)[]) => T[];
export declare const isBlank: (u: unknown) => boolean;
export declare const toObject: <K extends PropertyKey, V>(entries: readonly [K, V][]) => Record<K, V>;

import type {DefinedKeys, PartialKeys} from "./types";

// object retrievals
export const entries = <
  T extends Record<K,V>, K extends keyof T, V extends T[K],
>(obj:T|PartialKeys<T>):readonly [K,V][] => Object.entries(obj) as [K,V][];

// iterates keys and values of an object for the value is not undefined
export const entriesX = <
  T extends Record<K,V>,
  K extends DefinedKeys<T>,
  V extends T[K],
  VX extends V extends undefined ? never : V,
>(obj:T|PartialKeys<T>):readonly [K,VX][] =>
  Object.entries(obj).filter(([,v]) => v !== undefined) as [K,VX][];

export const valuesOf:{
  <T extends Record<K,V>, K extends keyof T, V extends T[K]>(obj:T):V[]
  <T extends Record<K,V>, K extends keyof T, V extends T[K]>
    (obj:Partial<T>):V[]
} = <T extends Record<K,V>, K extends keyof T, V extends T[K]>
  (obj:T|Partial<T>):V[] => Object.values(obj) as V[];

// keyの不在は許容するがキーが存在しながら値の不在は許容しない型関数
export const keysOf = <
  T extends Record<K,V>, K extends keyof T, V extends T[K],
>(obj:T|PartialKeys<T>) => Object.keys(obj) as K[];

export const compact = <T>(a:(T|undefined)[]) =>
  a.filter(v => v !== undefined) as T[];

export const isBlank = (u:unknown) => {
  if (u === null || u === undefined) return true;
  if (typeof u === 'string') return u.length === 0;
  if (Array.isArray(u)) return u.length === 0;
  if (typeof u === 'object') return keysOf(u).length === 0;
  return false;
};

export const toObject = <K extends string, V>(entries:readonly [K, V][]) =>
  Object.fromEntries(entries) as Record<K, V>;


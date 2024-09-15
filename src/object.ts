import type {PartialKeys} from "./types";

// keyの不在は許容するがキーが存在しながら値の不在は許容しない型関数
export const keysOf = <
  T extends Record<K,V>, K extends keyof T = keyof T, V extends T[K] = T[K],
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

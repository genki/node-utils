import type {Defined} from "./types";

// for sort()
export const acmp = <T extends number>(a:ArrayLike<T>, b:ArrayLike<T>) => {
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    if (d !== 0) return d;
  }
  return 0;
};

// xがundefinedの場合はvを、そうでない場合はxを返す
// 引数が省略された場合はT型のundefinedを返す
export function Q<T>():Q<T>;
export function Q<T,U=Defined<T>>(x:U|undefined|void, v:U):U;
export function Q<T,U=Defined<T>>(x?:U|void, v?:U):Q<U> {
  return x === undefined ? v : x;
}
export type Q<T> = T|undefined;

export const X = <T>(x:T|undefined):x is T => x !== undefined;

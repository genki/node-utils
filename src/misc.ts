import type {Defined, NotPromise} from "./types";

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
export function Q<T,U=Defined<T>>(x:U|undefined):U|undefined;
export function Q<T,U=Defined<T>>(x:U|undefined|void, v:U):U;
export function Q<T,U=Defined<T>>(x?:U|void, v?:U):Q<U> {
  return x === undefined ? v : x;
}
export type Q<T> = T|undefined;

// undefinedである余地が存在する型
export type QX<T> = undefined extends T ? T : never;

// check the existence of x. null or promise are not exist.
export type X<T> = Defined<QX<T>>&NotPromise<QX<T>>&Exclude<T,null>;
export function X<T extends QX<any>>(
  x:QX<T>
):x is X<T> extends QX<T> ? X<T> : never {
  return x !== undefined && x !== null;
}

// shorthand for Promise
export const P = <T>(x:T|Promise<T>):x is Promise<T> => x instanceof Promise;
export type P<T> = Promise<T>;

export const touch = (..._:any[]) => {};

export * from './types';
import type {Defined} from './types';

// xがundefinedの場合はvを、そうでない場合はxを返す
// 引数が省略された場合はT型のundefinedを返す
export function Q<T>():Q<T>;
export function Q<T,U=Defined<T>>(x:U|undefined|void, v:U):U;
export function Q<T,U=Defined<T>>(x?:U|void, v?:U):Q<U> {
  return x === undefined ? v : x;
}
export type Q<T> = T|undefined;

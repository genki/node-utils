export type RO<T> = Readonly<T>;
export type Defined<T = any> = Exclude<T,undefined>;
export type DefinedKeys<T> = {
  [K in keyof T]: T[K] extends undefined ? never : K
}[keyof T];

// Compact<T>はT型の値がundefinedではないプロパティを持つ型
export type Compact<
  T extends Record<K,V>,K extends PropertyKey = keyof T,V = T[K],
> = {[P in DefinedKeys<T>]: T[P]};

export type Upto<N extends number, A extends any[] = []> = A['length'] extends N
  ? A['length']
  : A['length'] | Upto<N, [...A, any]>;

export type NotPromise<T> = T extends Promise<any> ? never : T;
export type PartialKeys<T> = {
  [P in keyof T]?: Exclude<T[P], undefined>;
};

export type TupleSplit<
  T,
  I extends number,
  O extends any[] = []
> = O['length'] extends I
  ? [O, T]
  : T extends [infer F, ...infer R]
    ? TupleSplit<[...R], I, [...O, F]>
    : [O, T]

export type Cdr<T extends any[]> = T extends [any, ...infer R] ? R : never;

// タプル T の I 番目の要素を削除
export type RemoveAt<
  T extends any[], I extends number,
  T0 extends TupleSplit<T, I>[0] = TupleSplit<T, I>[0],
  T1 extends TupleSplit<T, I>[1] = TupleSplit<T, I>[1],
> = [...T0, ...Cdr<T1>];

export type ReplaceAt<
  T extends any[], I extends number, V,
  T0 extends TupleSplit<T, I>[0] = TupleSplit<T, I>[0],
  T1 extends TupleSplit<T, I>[1] = TupleSplit<T, I>[1],
> = [...T0, V, ...Cdr<T1>];

export type InsertAt<
  T extends any[], I extends number, V,
  T0 extends TupleSplit<T, I>[0] = TupleSplit<T, I>[0],
  T1 extends TupleSplit<T, I>[1] = TupleSplit<T, I>[1],
> = [...T0, V, ...T1];

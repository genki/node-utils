export type RO<T> = Readonly<T>;
export type Defined<T = any> = T extends infer U|undefined ? U : never;
export type DefinedKeys<T> = {
  [K in keyof T]: T[K] extends undefined ? never : K
}[keyof T];

// Compact<T>はT型の値がundefinedではないプロパティを持つ型
export type Compact<
  T extends Record<K,V>,
  K extends keyof T = keyof T,
  V extends T[K] = T[K],
> = {[P in DefinedKeys<T>]: T[P]};

export type Upto<N extends number, A extends any[] = []> = A['length'] extends N
  ? A['length']
  : A['length'] | Upto<N, [...A, any]>;

export type NotPromise<T> = T extends Promise<any> ? never : T;
export type PartialKeys<T> = {
  [P in keyof T]?: Exclude<T[P], undefined>;
};

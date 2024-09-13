export type RO<T> = Readonly<T>;
export type Defined<T = any> = T extends infer U|undefined ? U : never;

export type Upto<N extends number, A extends any[] = []> = A['length'] extends N
  ? A['length']
  : A['length'] | Upto<N, [...A, any]>;

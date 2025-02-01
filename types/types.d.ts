export type RO<T> = Readonly<T>;
export type Defined<T = any> = Exclude<T, undefined>;
export type DefinedKeys<T> = {
    [K in keyof T]: T[K] extends undefined ? never : K;
}[keyof T];
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Compact<T extends Record<K, V>, K extends PropertyKey = keyof T, V = T[K]> = {
    [P in DefinedKeys<T>]: T[P];
};
export type Upto<N extends number, A extends any[] = []> = A['length'] extends N ? A['length'] : A['length'] | Upto<N, [...A, any]>;
export type NotPromise<T> = T extends Promise<any> ? never : T;
export type PartialKeys<T> = {
    [P in keyof T]?: Exclude<T[P], undefined>;
};
declare const tmp: unique symbol;
type Tmp = typeof tmp;
type OptToTmp<T> = {
    [K in keyof T]: undefined extends T[K] ? T[K] | Tmp : T[K];
};
type UnOpt<T> = {
    [K in keyof T]-?: T[K];
};
type TmpToUndefined<T> = {
    [K in keyof T]: Tmp extends T[K] ? Exclude<T[K], Tmp> | undefined : T[K];
};
export type NormalizeOpt<T> = TmpToUndefined<UnOpt<OptToTmp<T>>>;
export type IsOpt<T extends any[], Keys extends keyof T> = {
    [Key in Keys]?: T[Key];
} extends Pick<T, Keys> ? true : false;
export type EscOpt<A extends any[]> = {
    [K in keyof A]-?: IsOpt<A, K> extends true ? A[K] | Tmp : A[K];
};
export type UnescOpt<T extends any[]> = T extends [infer F, ...infer R] ? Tmp extends F ? [_?: Exclude<F, Tmp>, ...UnescOpt<R>] : [F, ...UnescOpt<R>] : [];
export type TupleSplit<T extends any[], I extends number, O extends any[] = []> = O['length'] extends I ? [O, T] : EscOpt<T> extends [any, ...infer R] ? TupleSplit<[...UnescOpt<R>], I, [...O, T[0]]> : [O, T];
export type Cdr<T extends any[]> = EscOpt<T> extends [any, ...infer R] ? UnescOpt<R> : never;
export type RemoveAt<T extends any[], I extends number, T0 extends TupleSplit<T, I>[0] = TupleSplit<T, I>[0], T1 extends TupleSplit<T, I>[1] = TupleSplit<T, I>[1]> = [...T0, ...Cdr<T1>];
export type ReplaceAt<T extends any[], I extends number, V, T0 extends TupleSplit<T, I>[0] = TupleSplit<T, I>[0], T1 extends TupleSplit<T, I>[1] = TupleSplit<T, I>[1]> = [...T0, V, ...Cdr<T1>];
export type InsertAt<T extends any[], I extends number, V, T0 extends TupleSplit<T, I>[0] = TupleSplit<T, I>[0], T1 extends TupleSplit<T, I>[1] = TupleSplit<T, I>[1]> = [...T0, V, ...T1];
export type ParseNum<T extends string> = T extends `${infer U extends number}` ? U : never;
export type ToString<T extends number> = `${T}` extends `${infer U}` ? U : never;
export type IsLiteral<T, L> = T extends L ? L extends T ? false : true : false;
type LiteralArray<T extends readonly any[], L> = T extends [] ? true : T extends [infer Head, ...infer Tail] ? IsLiteral<Head, L> extends true ? LiteralArray<Tail, L> : false : true;
export type Literals<T extends readonly any[], L> = LiteralArray<T, L> extends true ? T : never;
export type Contains<A extends any[], T> = A extends [infer First, ...infer Rest] ? [First] extends [T] ? true : Contains<Rest, T> : false;
export type KeysToT<T, B> = Defined<{
    [K in keyof T]: T[K] extends B ? K : never;
}[keyof T]>;
export {};

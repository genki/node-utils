import { RemoveAt, ReplaceAt } from "./types";
export declare const setarg: <F extends (...args: any) => any, A0 extends F extends (...args: infer U) => any ? U : never, R extends F extends (...args: any) => infer U ? U : never, N extends number, V extends A0[N], A1 extends RemoveAt<A0, N>>(fn: F, i: N, v: V) => (...args: A1) => R;
export declare const marg: <F extends (...args: any) => any, A0 extends F extends (...args: infer U) => any ? U : never, R extends F extends (...args: any) => infer U ? U : never, N extends number, M extends (v: any) => A0[N] | Promise<A0[N]>, V extends M extends (v: infer U) => any ? U : never, A1 extends ReplaceAt<A0, N, V>, MR extends ReturnType<M> extends Promise<any> ? Promise<R> : R>(fn: F, i: N, m: M) => (...args: A1) => MR;
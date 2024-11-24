import { RemoveAt, ReplaceAt } from "./types";
export declare const bind: <A extends any[], R, T>(fn: (...a: A) => R, t: T) => (this: T | void, ...a: A) => R;
export declare const setarg: <F extends (...args: any) => any, A0 extends F extends (...args: infer U) => any ? U : never, R0 extends F extends (...args: any) => infer U ? U : never, N extends number, VV extends A0[N] | Promise<A0[N]>, V extends VV | (() => VV), A1 extends RemoveAt<A0, N>, R1 extends V extends Promise<any> ? Promise<R0> : V extends (...args: any) => Promise<any> ? Promise<R0> : R0>(fn: F, i: N, v: V) => (...args: A1) => R1;
export declare const marg: <const F extends (...args: any) => any, A0 extends F extends (...args: infer U) => any ? U : never, R0 extends F extends (...args: any) => infer U ? U : never, N extends number, const M extends (v: any) => any, V extends M extends (v: infer U) => any ? unknown extends U ? A0[N] : U : never, A1 extends ReplaceAt<A0, N, unknown extends V ? A0[N] : V>, R1 extends ReturnType<M> extends Promise<any> ? Promise<R0> : R0>(fn: F, i: N, m: M) => (...args: A1) => R1;
export declare const memoize: <F extends (...args: any) => any, A extends F extends (...args: infer U) => any ? U : any, R extends F extends (...args: A) => infer U ? U : any>(fn: F) => (...args: Parameters<F>) => R;

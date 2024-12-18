import {stringify} from "./stringify";
import {RemoveAt, ReplaceAt} from "./types";

// type-lossless bind
export const bind = <A extends any[],R,T>(fn:(...a:A) => R, t:T) =>
  fn.bind(t) as (this:T|void, ...a:A) => R;

// bind the i-th arg with v
export const setarg = <
  F extends (...args:any) => any,
  A0 extends F extends (...args:infer U) => any ? U : never,
  R0 extends F extends (...args:any) => infer U ? U : never,
  N extends number,
  VV extends A0[N]|Promise<A0[N]>,
  V extends VV|(() => VV),
  A1 extends RemoveAt<A0, N>,
  R1 extends V extends Promise<any>
    ? Promise<R0> : V extends (...args:any) => Promise<any> ? Promise<R0> : R0,
>(fn:F, i:N, v:V) => (...args:A1):R1 => {
  if (v instanceof Promise) {
    return v.then((v:V) => {
      args.splice(i, 1, v);
      return fn(...args) as R0;
    });
  } else if (typeof v === "function") {
    const r = v() as VV;
    return setarg(fn, i, r)(...args) as R1;
  } else {
    args.splice(i, 1, v);
  }
  return fn(...args) as R0;
}

// modify the i-th arg
// mがGeneric型の場合は元の型を維持する
export const marg = <
  const F extends (...args:any) => any,
  A0 extends F extends (...args:infer U) => any ? U : never,
  R0 extends F extends (...args:any) => infer U ? U : never,
  N extends number,
  const M extends (v:any) => any,
  V extends M extends(v:infer U) => any
    ? unknown extends U ? A0[N] : U
    : never,
  A1 extends ReplaceAt<A0,N,unknown extends V ? A0[N] : V>,
  R1 extends ReturnType<M> extends Promise<any> ? Promise<R0> : R0,
>(fn:F, i:N, m:M) => {
  return (...args:A1):R1 => {
    const v = m(args[i]);
    if (v instanceof Promise) {
      return v.then((v) => {
        args.splice(i, 1, v);
        return fn(...args);
      }) as R1;
    }
    args.splice(i, 1, v);
    return fn(...args);
  }
}

export const memoize = <
  F extends (...args:any) => any,
  A extends F extends (...args:infer U) => any ? U : any,
  R extends F extends (...args:A) => infer U ? U : any
>(fn:F) => {
  const memos = new Map<string,R>();
  return (...args:Parameters<F>):R => {
    const key = stringify(args);
    const memo = memos.get(key);
    if (memo) return memo;
    const value = fn(...args);
    memos.set(key, value);
    return value;
  };
};

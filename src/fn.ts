import {RemoveAt, ReplaceAt} from "./types";

// bind the i-th arg with v
export const setarg = <
  F extends (...args:any) => any,
  A0 extends F extends (...args:infer U) => any ? U : never,
  R0 extends F extends (...args:any) => infer U ? U : never,
  N extends number,
  V extends A0[N]|Promise<A0[N]>,
  A1 extends RemoveAt<A0, N>,
  R1 extends V extends Promise<any> ? Promise<R0> : R0,
>(fn:F, i:N, v:V) => (...args:A1):R1 => {
  if (v instanceof Promise) {
    return v.then((v:V) => {
      args.splice(i, 1, v);
      return fn(...args) as R0;
    });
  }
  args.splice(i, 1, v);
  return fn(...args) as R0;
}

// modify the i-th arg
export const marg = <
  F extends (...args:any) => any,
  A0 extends F extends (...args:infer U) => any ? U : never,
  R0 extends F extends (...args:any) => infer U ? U : never,
  N extends number,
  M extends (v:any) => A0[N]|Promise<A0[N]>,
  V extends M extends (v:infer U) => any ? U : never,
  A1 extends ReplaceAt<A0,N,V>,
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

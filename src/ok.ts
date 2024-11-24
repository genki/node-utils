const ok:unique symbol = Symbol('ok');
type V = Record<PropertyKey,any>|any[];
export type OK<F extends boolean = boolean> = {readonly [ok]:F};
export function Ok<T extends V>(x:T&OK):x is T extends OK<true> ? T : never;
export function Ok<T extends V>(x?:T):T&OK<true>;
export function Ok<T extends V>(x = {} as T):T&OK|boolean {
  if (ok in x) {
    const v = x[ok];
    if (typeof v === 'boolean') return v;
  }
  return {...x, [ok]:true} as const;
}
export const OK = {[ok]:true} as const;
export const NO = {[ok]:false} as const;

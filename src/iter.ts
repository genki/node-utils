// undefined同士の比較は文脈依存になるのでサポートしない
export const eqA = <A extends ArrayLike<T>,T>(a:A, b?:A) => {
  if (!b) return false;
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

type CMP<T> = (a:T, b:T) => boolean;
export function same<A extends any[], K extends keyof A[number]>(
  this:CMP<A[0][K]>|void, key:K, ...a:A
):boolean {
  const vs = a.map(v => v[key]);
  for (let i = 1; i < a.length; i++) {
    if (typeof this === 'function') {
      if (!this(vs[i-1], vs[i])) return false;
    } else {
      if (vs[i-1] !== vs[i]) return false;
    }
  }
  return true;
}

export const groupBy = <
  T extends Record<K,V>,
  K extends keyof T,
  V extends PropertyKey,
>(
  a:T[], key:K
) => {
  const map = {} as Record<T[K],T[]>;
  for (const v of a) {
    const k = v[key];
    if (!map[k]) map[k] = [];
    map[k].push(v);
  }
  return map;
}

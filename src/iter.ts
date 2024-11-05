// undefined同士の比較は文脈依存になるのでサポートしない
export const eqA = <A extends ArrayLike<T>,T>(a:A, b?:A) => {
  if (!b) return false;
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

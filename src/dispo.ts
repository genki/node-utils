// disposable containers

export const isDispo = (x:any):
x is {[Symbol.dispose]:() => any} => {
  return x[Symbol.dispose] instanceof Function;
};
export const isAsyncDispo = (x:any):
x is {[Symbol.asyncDispose]:() => Promise<any>} => {
  return x[Symbol.asyncDispose] instanceof Function;
};

export type DispoArray<T extends object> = Array<T> & {
  [Symbol.dispose]:() => void;
  [Symbol.asyncDispose]:() => Promise<void>;
}
export const DispoArray = <T extends object>(a:Array<T> = []) => {
  const da = a as DispoArray<T>;
  da[Symbol.dispose] = () => {
    for (const i of a) if (isDispo(i)) i[Symbol.dispose]();
    a.length = 0;
  };
  da[Symbol.asyncDispose] = async () => {
    for (const i of a) if (isAsyncDispo(i)) await i[Symbol.asyncDispose]();
    a.length = 0;
  };
  return da;
}

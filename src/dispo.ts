// disposable containers

type Dispo = {
  [Symbol.dispose]?:() => void;
  [Symbol.asyncDispose]?:() => Promise<void>;
}

export const isDispo = (x:any):
x is {[Symbol.dispose]:() => any} => {
  return x[Symbol.dispose] instanceof Function;
};
export const isAsyncDispo = (x:any):
x is {[Symbol.asyncDispose]:() => Promise<any>} => {
  return x[Symbol.asyncDispose] instanceof Function;
};

export type DispoArray<T extends object> = Array<T>&Dispo & {
  [Symbol.dispose]:() => void;
  [Symbol.asyncDispose]:() => Promise<void>;
}
export const DispoArray = <T extends object>(a:Array<T>&Dispo = []) => {
  const da = a as DispoArray<T>;
  const dispo = a[Symbol.dispose];
  da[Symbol.dispose] = () => {
    for (const i of a) if (isDispo(i)) i[Symbol.dispose]();
    a.length = 0;
    if (dispo) dispo();
  };
  const asyncDispo = a[Symbol.asyncDispose];
  da[Symbol.asyncDispose] = async () => {
    for (const i of a) if (isAsyncDispo(i)) await i[Symbol.asyncDispose]();
    a.length = 0;
    if (asyncDispo) await asyncDispo();
  };
  return da;
}

export const toDispo = <O extends object, R>(o:O, dispo:() => R) => {
  const d = o as O & Dispo;
  if (dispo.constructor.name === "AsyncFunction") {
    d[Symbol.asyncDispose] = dispo as () => Promise<any>;
  } else {
    d[Symbol.dispose] = dispo;
  }
  return d;
}

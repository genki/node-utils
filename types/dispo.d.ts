type Dispo = {
    [Symbol.dispose]?: () => void;
    [Symbol.asyncDispose]?: () => Promise<void>;
};
export declare const isDispo: (x: any) => x is {
    [Symbol.dispose]: () => any;
};
export declare const isAsyncDispo: (x: any) => x is {
    [Symbol.asyncDispose]: () => Promise<any>;
};
export type DispoArray<T extends object> = Array<T> & Dispo & {
    [Symbol.dispose]: () => void;
    [Symbol.asyncDispose]: () => Promise<void>;
};
export declare const DispoArray: <T extends object>(a?: Array<T> & Dispo) => DispoArray<T>;
export declare const toDispo: <O extends object, R>(o: O, dispo: () => R) => O & Dispo;
export {};

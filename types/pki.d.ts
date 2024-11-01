import { Packed } from "./schema";
type B64 = string;
export type KeyPair = {
    pk: B64;
    sk: B64;
};
export declare const signRaw: (sk: B64, data: Uint8Array) => Promise<string>;
export declare const sign: (sk: B64, msg: string) => Promise<string>;
export declare const verify: (pk: B64, message: string, signature: B64) => Promise<boolean>;
export declare const verifyPair: (pk: B64, sk: B64) => Promise<boolean>;
export declare const verifyCryptPair: (pk: B64, sk: B64) => Promise<boolean>;
export declare const genSignKeyPair: () => Promise<{
    pk: string;
    sk: string;
}>;
export declare const genPubkey: (sk: B64) => Promise<string>;
export declare const takePubkey: (pk: B64) => Promise<CryptoKey>;
export declare const genCryptKeyPair: () => Promise<{
    pk: string;
    sk: string;
}>;
export declare const genPackedKeyPair: () => Promise<string & import("valibot").Brand<"Packed">>;
export interface Cipher<T = B64> {
    iv: T;
    secret: T;
    data: T;
}
export declare const encryptA: (pk: ArrayBuffer, message: string) => Promise<{
    iv: Uint8Array;
    data: Uint8Array;
    secret: Uint8Array;
}>;
export declare const encryptAP: (pk: ArrayBuffer, message: string) => Promise<string & import("valibot").Brand<"Packed">>;
export declare const encrypt: (pk: B64, message: string) => Promise<{
    iv: string;
    data: string;
    secret: string;
}>;
export declare const decryptA: (sk: ArrayBuffer, cipher: Cipher<ArrayBuffer>) => Promise<string>;
export declare const decryptAP: (sk: ArrayBuffer, cipher: Packed) => Promise<string>;
export declare const decrypt: (sk: B64, { iv, data, secret }: Cipher) => Promise<string>;
export declare const encipherRaw: (msg: Uint8Array, secret?: Uint8Array, iv?: Uint8Array) => Promise<Cipher<Uint8Array>>;
export declare const encipher: (msg: Packed, secret?: Uint8Array, iv?: Uint8Array) => Promise<Cipher<Packed>>;
export declare const decipherRaw: (cipher: Cipher<Uint8Array>) => Promise<Uint8Array>;
export declare const decipher: (cipher: Cipher<Packed>) => Promise<string & import("valibot").Brand<"Packed">>;
export {};

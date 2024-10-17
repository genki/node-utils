import {Packed} from "./schema";
import {joinPacked, packA, packAB, packABs, unpackA, unpackAs} from "./string";

// Convert ArrayBuffer to base64 string.
type AB = ArrayBuffer;
const ab2s = (buf:AB) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const stoa = (key:string) => Uint8Array.from(key, c => c.charCodeAt(0));

// type for the 2nd argument of crypto.subtle.importKey()
type Key = Uint8Array | JsonWebKey;
type B64 = string;
export type KeyPair = {pk:B64, sk:B64};

const loadPubkey = async (pk:Key, type:any, usage:KeyUsage[] = ['verify']) => {
  return await crypto.subtle.importKey(type, pk as any,
    {name:'ECDSA', namedCurve:'P-256', hash:'SHA-256'}, true, usage
  );
}

export const signRaw = async (sk:B64, data:Uint8Array) => {
  const secret = stoa(atob(sk));
  const privkey = await crypto.subtle.importKey('pkcs8', secret,
    {name: 'ECDSA', namedCurve: 'P-256', hash: 'SHA-256'}, true, ['sign']);
  const sigbuf = await crypto.subtle.sign(
    {name: 'ECDSA', hash: {name: 'SHA-256'}}, privkey, data);
  return btoa(String.fromCharCode(...new Uint8Array(sigbuf)));
};
export const sign = async (sk:B64, msg:string) => signRaw(sk, stoa(msg));

export const verify = async (pk:B64, message:string, signature:B64) => { try {
  const pubkey = await loadPubkey(stoa(atob(pk)), 'raw');
  return crypto.subtle.verify(
    {name: 'ECDSA', hash: {name: 'SHA-256'}},
    pubkey, stoa(atob(signature)), stoa(message)
  );
} catch(e) { return false } };

export const verifyPair = async (pk:B64, sk:B64) => {
  const sig = await sign(sk, 'hello');
  return verify(pk, 'hello', sig);
}

export const verifyCryptPair = async (pk:B64, sk:B64) => {
  const cipher = await encrypt(pk, 'hello');
  return await decrypt(sk, cipher) === 'hello';
}

// pkは65バイトの非圧縮形式
// wasm前提の環境では圧縮形式に変換して使う
export const genSignKeyPair = async () => {
  const key = await crypto.subtle.generateKey(
    {name: 'ECDSA', namedCurve: 'P-256', hash: 'SHA-256'}, true, ['sign']);
  const sk = ab2s(await crypto.subtle.exportKey('pkcs8', key.privateKey));
  const pk = ab2s(await crypto.subtle.exportKey('raw', key.publicKey));
  return {pk, sk};
};

export const genPubkey = async (sk:B64) => {
  const secret = stoa(atob(sk));
  const privkey = await crypto.subtle.importKey('pkcs8', secret,
    {name: 'ECDSA', namedCurve: 'P-256', hash: 'SHA-256'}, true, ['sign']);
  const jwk = await crypto.subtle.exportKey('jwk', privkey);
  delete jwk.d;
  jwk.key_ops = ['verify'];
  const pubkey = await loadPubkey(jwk, 'jwk');
  return btoa(String.fromCharCode(...new Uint8Array(
    await crypto.subtle.exportKey('raw', pubkey))));
}

export const takePubkey = async (pk:B64) => loadPubkey(stoa(atob(pk)), 'raw');

// for encryption/decryption
export const genCryptKeyPair = async () => {
  const key = await crypto.subtle.generateKey(
    {name: 'RSA-OAEP', modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'}, true, ['encrypt', 'decrypt']);
  const sk = ab2s(await crypto.subtle.exportKey('pkcs8', key.privateKey));
  const pk = ab2s(await crypto.subtle.exportKey('spki', key.publicKey));
  return {pk, sk};
};

export const genPackedKeyPair = async () => {
  const key = await crypto.subtle.generateKey(
    {name: 'RSA-OAEP', modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'}, true, ['encrypt', 'decrypt']);

  const sk = packAB(await crypto.subtle.exportKey('pkcs8', key.privateKey));
  const pk = packAB(await crypto.subtle.exportKey('spki', key.publicKey));
  return joinPacked([pk, sk]);
};

const genRandomKey = async () => {
  return await crypto.subtle.generateKey(
    {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
}

const genKey = async (key:Uint8Array) => {
  return await crypto.subtle.importKey('raw', key,
    {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
}

export interface Cipher<T = B64> {
  iv: T;
  secret: T;
  data: T;
}

// 公開鍵による暗号化
export const encryptA = async (pk:ArrayBuffer, message:string) => {
  const enc = new TextEncoder();
  const key = await genRandomKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    {name: 'AES-GCM', iv}, key, enc.encode(message));
  const pubkey = await crypto.subtle.importKey('spki', pk,
    {name: 'RSA-OAEP', hash: 'SHA-256'}, true, ['encrypt']);
  const secret = await crypto.subtle.encrypt(
    {name: 'RSA-OAEP'}, pubkey, await crypto.subtle.exportKey('raw', key));
  return {iv, data:new Uint8Array(cipher), secret:new Uint8Array(secret)};
}
export const encryptAP = async (pk:ArrayBuffer, message:string) => {
  const {iv, data, secret} = await encryptA(pk, message);
  return packABs([iv, data, secret]);
}
export const encrypt = async (pk:B64, message:string) => {
  const {iv, data, secret} = await encryptA(stoa(atob(pk)), message);
  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(data))),
    secret: btoa(String.fromCharCode(...new Uint8Array(secret))),
  };
};

// 秘密鍵による復号
export const decryptA = async (sk:ArrayBuffer, cipher:Cipher<ArrayBuffer>) => {
  const {iv, data, secret} = cipher;
  const privkey = await crypto.subtle.importKey('pkcs8', sk,
    {name: 'RSA-OAEP', hash: 'SHA-256'}, true, ['decrypt']);
  const keyBuf = await crypto.subtle.decrypt(
    {name: 'RSA-OAEP'}, privkey, secret);
  const key = await crypto.subtle.importKey('raw', keyBuf,
    {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
  const dec = new TextDecoder();
  const plain = await crypto.subtle.decrypt(
    {name: 'AES-GCM', iv}, key, data);
  return dec.decode(plain);
}
export const decryptAP = async (sk:ArrayBuffer, cipher:Packed) => {
  const [iv, data, secret] = unpackAs(cipher);
  return decryptA(sk, {iv, data, secret});
}
export const decrypt = async (sk:B64, {iv, data, secret}:Cipher) => {
  return decryptA(stoa(atob(sk)), {
    iv: stoa(atob(iv)),
    data: stoa(atob(data)),
    secret: stoa(atob(secret)),
  });
}

export const encipherRaw = async (
  msg:Uint8Array, secret?:Uint8Array, iv?:Uint8Array,
):Promise<Cipher<Uint8Array>> => {
  const key = await (secret ? genKey(secret) : genRandomKey());
  iv ??= crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({name: 'AES-GCM', iv}, key, msg);
  return {
    iv, data: new Uint8Array(cipher),
    secret: new Uint8Array(await crypto.subtle.exportKey('raw', key)),
  };
}

// 共有鍵による暗号化
// 共有鍵は iv と secret. 暗号データは data.
// secretを指定しない場合はランダムに生成される
export const encipher = async (
  msg:Packed, secret?:Uint8Array, iv?:Uint8Array,
):Promise<Cipher<Packed>> => {
  const cipher = await encipherRaw(unpackA(msg), secret, iv);
  return {
    iv: packA(cipher.iv),
    data: packA(cipher.data),
    secret: packA(cipher.secret),
  };
}

export const decipherRaw = async (cipher:Cipher<Uint8Array>) => {
  const {iv, data, secret} = cipher;
  const key = await genKey(secret);
  const plain = await crypto.subtle.decrypt(
    {name: 'AES-GCM', iv}, key, data);
  return new Uint8Array(plain);
}

// 共有鍵による復号
export const decipher = async (cipher:Cipher<Packed>) => {
  return packA(await decipherRaw({
    iv: unpackA(cipher.iv),
    data: unpackA(cipher.data),
    secret: unpackA(cipher.secret),
  }));
}

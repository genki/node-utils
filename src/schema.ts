import {
  BaseSchema, type Output, parse as _parse, safeParse, unknown, Pipe, brand,
  string, custom, coerce, instance, minValue, integer, number, minLength, is,
  special
} from "valibot";
import {decode, encode} from "@msgpack/msgpack";
import type {NotPromise} from "./types";
import {packA, unpackA} from "./string";
import {Q} from "./misc";
import {EB, MAX_EB, NOISE_BYTES} from "./noise";
import {stringify} from "./stringify";

export const natural = <P extends any[]>(min = 0, ...pipe:P) =>
  number([minValue(min), integer(), ...pipe]);
export const packed = (pipe?:Pipe<string>) => brand(string(pipe), "Packed");
const PackedSchema = packed();
export type Packed = Output<typeof PackedSchema>;

export const array8n = (n:number) => coerce(instance(Uint8Array, [
  custom(a => a.length === n)
]), a => a instanceof ArrayBuffer ? new Uint8Array(a) : a);
export const ULIDSchema = brand(array8n(16), "ULID");
export type ULID = Output<typeof ULIDSchema>;

// serverと通信する場合には使えない. バイト列にする必要がある
export const DataSchema = instance(Uint8Array);
export const EBSchema = special<EB>(n =>
  typeof n === 'number' && n >= 0 && n <= MAX_EB);

export const SKSchema = brand(array8n(32), "SK");
export type SK = Output<typeof SKSchema>;
export const PKSchema = brand(array8n(33), "PK");
export type PK = Output<typeof PKSchema>;
export type Nonce = PK;
export const SigSchema = brand(array8n(64), "Sig");
export type Sig = Output<typeof SigSchema>;

export const UserIDSchema = brand(packed([minLength(17)]), "UserID");
export type UserID = Output<typeof UserIDSchema>;
export const asUserID = (pk:PK) => packA(pk) as UserID;
export const toPK = (uid:UserID) => unpackA(uid) as PK;

const isSK = (a:unknown):a is SK => is(SKSchema, a);
const isPK = (a:unknown):a is PK => is(PKSchema, a);
const isSig = (a:unknown):a is Sig => is(SigSchema, a);

export const asSK = (a:any[]|Uint8Array):SK => {
  if (a instanceof Array) return asSK(new Uint8Array(a));
  if (!isSK(a)) throw Error(`Invalid SK: ${stringify(a)}`);
  return a;
}
export const asPK = (a:any[]|Uint8Array):PK => {
  if (a instanceof Array) return asPK(new Uint8Array(a));
  if (!isPK(a)) throw Error(`Invalid PK: ${stringify(a)}`);
  return a;
}
export const asSig = (a:any[]|Uint8Array):Sig => {
  if (a instanceof Array) return asSig(new Uint8Array(a));
  if (!isSig(a)) throw Error(`Invalid Sig: ${stringify(a)}`);
  return a;
}

export const pkEq = (a:PK, b:PK) =>
  a.every((v:number, i:number) => v === b[i]);
export const sigEq = (s1:Sig, s2:Sig) => {
  for (let i = 0; i < s1.length; ++i) if (s1[i] !== s2[i]) return false;
  return true;
}

// Seq Rowのためのpacked sig.
// Recordのkeyにするために文字列である必要がある
export const SignSchema = brand(packed([minLength(32)]), "Sign");
export type Sign = Output<typeof SignSchema>;
export const asSign = (sig:Sig) => packA(sig) as Sign;
export const toSig = (sign:Sign) => unpackA(sign) as Sig;

export const NoiseSchema = brand(array8n(NOISE_BYTES), "Noise");
export type Noise = Output<typeof NoiseSchema>;
export const PackedNoiseSchema = brand(packed(), "PackedNoise");
export type PackedNoise = Output<typeof PackedNoiseSchema>;

export const parseX = <S extends BaseSchema, V>(
  schema:S, value:NotPromise<V>, def?:Output<S>
):Output<S> => { try {
  return _parse(schema, value);
} catch (e) {
  if (def !== undefined) return def;
  const {issues} = safeParse(schema, value);
  console.error("Failed to parse", {schema, value, issues});
  throw e;
} };
export const parseQ = <S extends BaseSchema, V, O = Output<S>>(
  schema:S, value:NotPromise<V>
):Q<O> => {
  const {issues, output} = safeParse(schema, value);
  if (issues && issues.length > 0) return undefined;
  return output as O;
};
export const decodeA = <S extends BaseSchema>(
  code:Uint8Array|ArrayBuffer, schema?:S
):Output<S> => parseX(schema ?? unknown(), decode(code));
export const decodeS = <S extends BaseSchema>(
  str:Packed, schmea?:S
):Output<S> => decodeA(unpackA(str), schmea);
export const encodeA = <S extends BaseSchema>(
  value:S extends undefined ? unknown : Output<S>, schema?:S
) => encode(_parse(schema ?? unknown(), value), {ignoreUndefined: true});
// カスケーディング用
export const outofQ = <T extends BaseSchema, O = Output<T>>(
  schema:T, value:unknown, then?:(value:O) => Q<boolean>
): Q<boolean> => {
  const out:Q<O> = parseQ(schema, value);
  if (out === undefined) return;
  if (then) return then(value as O); // mutableなvalueインスタンスを渡す
  return true;
};
// 型ガード用.
export const outof = <
  T extends BaseSchema,
  V extends NotPromise<unknown>, O extends Output<T> = Output<T>
>(
  schema:T, value:V, then?:(value:O) => Q<boolean>
): value is O => !!outofQ(schema, value, then);

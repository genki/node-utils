import {
  GenericSchema, type InferOutput, parse as _parse, safeParse, unknown, brand,
  string, instance, minValue, integer, number, minLength, is, custom, pipe,
  transform, length, union, BaseIssue,
} from "valibot"
import {decode, encode} from "@msgpack/msgpack";
import type {NotPromise} from "./types";
import {packA, unpackA} from "./string";
import {Q} from "./misc";
import {EB, MAX_EB, NOISE_BYTES} from "./noise";
import {stringify} from "./stringify";

export const natural = (min = 0) => pipe(number(), minValue(min) , integer());
export const packed = () => pipe(string(), brand("Packed"));
const PackedSchema = packed();
export type Packed = InferOutput<typeof PackedSchema>;
export const Packed = <T extends string>(v:T) => {
  if (/\u007f[\u0840-\u08fc]/.test(v)) throw Error(`Invalid Packed: ${v}`);
  return v as T & Packed;
}

export const array8n = (n:number) => pipe(
  union([instance(Uint8Array), instance(ArrayBuffer)]),
  transform(a => a instanceof ArrayBuffer ? new Uint8Array(a) : a),
  length(n),
);
export const ULIDSchema = pipe(array8n(16), brand("ULID"));
export type ULID = InferOutput<typeof ULIDSchema>;

// serverと通信する場合には使えない. バイト列にする必要がある
export const DataSchema = instance(Uint8Array);
export const EBSchema = custom<EB>(n =>
  typeof n === 'number' && n >= 0 && n <= MAX_EB);

export const SKSchema = pipe(array8n(32), brand("SK"));
export type SK = InferOutput<typeof SKSchema>;
export const PKSchema = pipe(array8n(33), brand("PK"));
export type PK = InferOutput<typeof PKSchema>;
export type Nonce = PK;
export const SigSchema = pipe(array8n(64), brand("Sig"));
export type Sig = InferOutput<typeof SigSchema>;

export const UserIDSchema = pipe(
  pipe(packed(), minLength(17)), brand("UserID"));
export type UserID = InferOutput<typeof UserIDSchema>;
export const asUserID = (pk:PK) => packA(pk) as UserID;
export const toPK = (uid:UserID) => unpackA(uid) as PK;

export const isSK = (a:unknown):a is SK => is(SKSchema, a);
export const isPK = (a:unknown):a is PK => is(PKSchema, a);
export const isSig = (a:unknown):a is Sig => is(SigSchema, a);

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
export const SignSchema = pipe(
  pipe(packed(), minLength(32)), brand("Sign"));
export type Sign = InferOutput<typeof SignSchema>;
export const asSign = (sig:Sig) => packA(sig) as Sign;
export const toSig = (sign:Sign) => unpackA(sign) as Sig;

export const NoiseSchema = pipe(array8n(NOISE_BYTES), brand("Noise"));
export type Noise = InferOutput<typeof NoiseSchema>;
export const PackedNoiseSchema = pipe(packed(), brand("PackedNoise"));
export type PackedNoise = InferOutput<typeof PackedNoiseSchema>;

export const parseX = <S extends GenericSchema, V>(
  schema:S, value:NotPromise<V>, def?:InferOutput<S>
):InferOutput<S> => { try {
  return _parse(schema, value);
} catch (e) {
  if (def !== undefined) return def;
  const {issues} = safeParse(schema, value);
  console.error("Failed to parse", {schema, value, issues});
  throw e;
} };
type Issues = [BaseIssue<unknown>, ...BaseIssue<unknown>[]];
type OnFail = <V>(issues:Issues, value:V, schema:GenericSchema) => void;
export const parseQ = <S extends GenericSchema, V, O = InferOutput<S>>(
  schema:S, value:NotPromise<V>, onFail?:OnFail,
):Q<O> => {
  const {issues, output} = safeParse(schema, value);
  if (issues && issues.length > 0) {
    if (onFail) onFail(issues, value, schema);
    return undefined;
  }
  return output as O;
};

// codec for string/Uint8Array
// schemaを指定するとparseした結果をencodeする
// encode to string
export const decodeA = <S extends GenericSchema>(
  code:Uint8Array|ArrayBuffer, schema?:S
):InferOutput<S> => parseX(schema ?? unknown(), decode(code));
export const decodeS = <S extends GenericSchema>(
  str:Packed, schmea?:S
):InferOutput<S> => decodeA(unpackA(str), schmea);
export const encodeA = <S extends GenericSchema>(
  value:S extends undefined ? unknown : InferOutput<S>, schema?:S
) => encode(_parse(schema ?? unknown(), value), {ignoreUndefined: true});
export const encodeS = <S extends GenericSchema>(
  value:S extends undefined ? unknown : InferOutput<S>, schema?:S
) => packA(encodeA(value, schema));

// カスケーディング用
export const outofQ = <T extends GenericSchema,R,O = InferOutput<T>>(
  schema:T, value:unknown, then?:(value:O) => R, onFail?:OnFail
): R|Q<boolean> => {
  const out:Q<O> = parseQ(schema, value, onFail);
  if (out === undefined) return;
  if (then) return then(value as O); // mutableなvalueインスタンスを渡す
  return true;
};
export const outofQA = async <S extends GenericSchema,R>(
  schema:S, value:unknown,
  then?:(value:InferOutput<S>) => Promise<R>,
  onFail?:OnFail
): Promise<R|Q<boolean>> => {
  const out = parseQ(schema, value, onFail);
  if (out === undefined) return;
  if (then) return then(value); // mutableなvalueインスタンスを渡す
  return true;
};
// 型ガード用.
export const outof = <S extends GenericSchema>(
  schema:S, value:unknown,
  then?:(value:InferOutput<S>) => Q<boolean>, onFail?:OnFail
): value is InferOutput<S> => !!outofQ(schema, value, then, onFail);
export const outofX = <S extends GenericSchema>(
  schema:S, value:unknown, onFail?:OnFail
): value is InferOutput<S> => !!outofQ(schema, value, undefined, onFail);

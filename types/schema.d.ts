import { GenericSchema, type InferOutput, BaseIssue } from "valibot";
import type { NotPromise } from "./types";
import { Q } from "./misc";
export declare const natural: (min?: number) => import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").MinValueAction<number, number, undefined>, import("valibot").IntegerAction<number, undefined>]>;
export declare const packed: () => import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").BrandAction<string, "Packed">]>;
declare const PackedSchema: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").BrandAction<string, "Packed">]>;
export type Packed = InferOutput<typeof PackedSchema>;
export declare const Packed: <T extends string>(v: T) => T & Packed;
export declare const array8n: (n: number) => import("valibot").SchemaWithPipe<[import("valibot").UnionSchema<[import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>, import("valibot").InstanceSchema<ArrayBufferConstructor, undefined>], undefined>, import("valibot").TransformAction<ArrayBuffer | Uint8Array, Uint8Array>, import("valibot").LengthAction<Uint8Array, number, undefined>]>;
export declare const ULIDSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").UnionSchema<[import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>, import("valibot").InstanceSchema<ArrayBufferConstructor, undefined>], undefined>, import("valibot").TransformAction<ArrayBuffer | Uint8Array, Uint8Array>, import("valibot").LengthAction<Uint8Array, number, undefined>]>, import("valibot").BrandAction<Uint8Array, "ULID">]>;
export type ULID = InferOutput<typeof ULIDSchema>;
export declare const DataSchema: import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>;
export declare const EBSchema: import("valibot").CustomSchema<0 | 2 | 1 | 22 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 32 | 21 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31, undefined>;
export declare const SKSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").UnionSchema<[import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>, import("valibot").InstanceSchema<ArrayBufferConstructor, undefined>], undefined>, import("valibot").TransformAction<ArrayBuffer | Uint8Array, Uint8Array>, import("valibot").LengthAction<Uint8Array, number, undefined>]>, import("valibot").BrandAction<Uint8Array, "SK">]>;
export type SK = InferOutput<typeof SKSchema>;
export declare const PKSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").UnionSchema<[import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>, import("valibot").InstanceSchema<ArrayBufferConstructor, undefined>], undefined>, import("valibot").TransformAction<ArrayBuffer | Uint8Array, Uint8Array>, import("valibot").LengthAction<Uint8Array, number, undefined>]>, import("valibot").BrandAction<Uint8Array, "PK">]>;
export type PK = InferOutput<typeof PKSchema>;
export type Nonce = PK;
export declare const SigSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").UnionSchema<[import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>, import("valibot").InstanceSchema<ArrayBufferConstructor, undefined>], undefined>, import("valibot").TransformAction<ArrayBuffer | Uint8Array, Uint8Array>, import("valibot").LengthAction<Uint8Array, number, undefined>]>, import("valibot").BrandAction<Uint8Array, "Sig">]>;
export type Sig = InferOutput<typeof SigSchema>;
export declare const UserIDSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").BrandAction<string, "Packed">]>, import("valibot").MinLengthAction<string & import("valibot").Brand<"Packed">, 17, undefined>]>, import("valibot").BrandAction<string & import("valibot").Brand<"Packed">, "UserID">]>;
export type UserID = InferOutput<typeof UserIDSchema>;
export declare const asUserID: (pk: PK) => UserID;
export declare const toPK: (uid: UserID) => PK;
export declare const isSK: (a: unknown) => a is SK;
export declare const isPK: (a: unknown) => a is PK;
export declare const isSig: (a: unknown) => a is Sig;
export declare const asSK: (a: any[] | Uint8Array) => SK;
export declare const asPK: (a: any[] | Uint8Array) => PK;
export declare const asSig: (a: any[] | Uint8Array) => Sig;
export declare const pkEq: (a: PK, b: PK) => boolean;
export declare const sigEq: (s1: Sig, s2: Sig) => boolean;
export declare const SignSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").BrandAction<string, "Packed">]>, import("valibot").MinLengthAction<string & import("valibot").Brand<"Packed">, 32, undefined>]>, import("valibot").BrandAction<string & import("valibot").Brand<"Packed">, "Sign">]>;
export type Sign = InferOutput<typeof SignSchema>;
export declare const asSign: (sig: Sig) => Sign;
export declare const toSig: (sign: Sign) => Sig;
export declare const NoiseSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").UnionSchema<[import("valibot").InstanceSchema<Uint8ArrayConstructor, undefined>, import("valibot").InstanceSchema<ArrayBufferConstructor, undefined>], undefined>, import("valibot").TransformAction<ArrayBuffer | Uint8Array, Uint8Array>, import("valibot").LengthAction<Uint8Array, number, undefined>]>, import("valibot").BrandAction<Uint8Array, "Noise">]>;
export type Noise = InferOutput<typeof NoiseSchema>;
export declare const PackedNoiseSchema: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").BrandAction<string, "Packed">]>, import("valibot").BrandAction<string & import("valibot").Brand<"Packed">, "PackedNoise">]>;
export type PackedNoise = InferOutput<typeof PackedNoiseSchema>;
export declare const parseX: <S extends GenericSchema, V>(schema: S, value: NotPromise<V>, def?: InferOutput<S>) => InferOutput<S>;
type Issues = [BaseIssue<unknown>, ...BaseIssue<unknown>[]];
type OnFail = <V>(issues: Issues, value: V, schema: GenericSchema) => void;
export declare const parseQ: <S extends GenericSchema, V, O = InferOutput<S>>(schema: S, value: NotPromise<V>, onFail?: OnFail) => Q<O>;
export declare const decodeA: <S extends GenericSchema>(code: Uint8Array | ArrayBuffer, schema?: S) => InferOutput<S>;
export declare const decodeS: <S extends GenericSchema>(str: Packed, schmea?: S) => InferOutput<S>;
export declare const encodeA: <S extends GenericSchema>(value: S extends undefined ? unknown : InferOutput<S>, schema?: S) => Uint8Array;
export declare const encodeS: <S extends GenericSchema>(value: S extends undefined ? unknown : InferOutput<S>, schema?: S) => string & import("valibot").Brand<"Packed">;
export declare const outofQ: <T extends GenericSchema, R, O = InferOutput<T>>(schema: T, value: unknown, then?: (value: O) => R, onFail?: OnFail) => R | Q<boolean>;
export declare const outofQA: <S extends GenericSchema, R>(schema: S, value: unknown, then?: (value: InferOutput<S>) => Promise<R>, onFail?: OnFail) => Promise<R | Q<boolean>>;
export declare const outof: <S extends GenericSchema>(schema: S, value: unknown, then?: (value: InferOutput<S>) => Q<boolean>, onFail?: OnFail) => value is InferOutput<S>;
export declare const outofX: <S extends GenericSchema>(schema: S, value: unknown, onFail?: OnFail) => value is InferOutput<S>;
export {};

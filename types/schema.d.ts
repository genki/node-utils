import { BaseSchema, type Output, Pipe, Issues } from "valibot";
import type { NotPromise } from "./types";
import { Q } from "./misc";
export declare const natural: <P extends Pipe<number>>(min?: number, pipe?: P) => import("valibot").NumberSchema<number>;
export declare const packed: <P extends Pipe<string>>(pipe?: P) => import("valibot").SchemaWithBrand<import("valibot").StringSchema<string>, "Packed">;
declare const PackedSchema: import("valibot").SchemaWithBrand<import("valibot").StringSchema<string>, "Packed">;
export type Packed = Output<typeof PackedSchema>;
export declare const Packed: <T extends string>(v: T) => T & Packed;
export declare const array8n: (n: number) => import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>;
export declare const ULIDSchema: import("valibot").SchemaWithBrand<import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>, "ULID">;
export type ULID = Output<typeof ULIDSchema>;
export declare const DataSchema: import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>;
export declare const EBSchema: import("valibot").SpecialSchema<0 | 1 | 10 | 2 | 3 | 4 | 32 | 16 | 6 | 8 | 5 | 7 | 9 | 11 | 12 | 13 | 14 | 15 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31, 0 | 1 | 10 | 2 | 3 | 4 | 32 | 16 | 6 | 8 | 5 | 7 | 9 | 11 | 12 | 13 | 14 | 15 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31>;
export declare const SKSchema: import("valibot").SchemaWithBrand<import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>, "SK">;
export type SK = Output<typeof SKSchema>;
export declare const PKSchema: import("valibot").SchemaWithBrand<import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>, "PK">;
export type PK = Output<typeof PKSchema>;
export type Nonce = PK;
export declare const SigSchema: import("valibot").SchemaWithBrand<import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>, "Sig">;
export type Sig = Output<typeof SigSchema>;
export declare const UserIDSchema: import("valibot").SchemaWithBrand<import("valibot").SchemaWithBrand<import("valibot").StringSchema<string>, "Packed">, "UserID">;
export type UserID = Output<typeof UserIDSchema>;
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
export declare const SignSchema: import("valibot").SchemaWithBrand<import("valibot").SchemaWithBrand<import("valibot").StringSchema<string>, "Packed">, "Sign">;
export type Sign = Output<typeof SignSchema>;
export declare const asSign: (sig: Sig) => Sign;
export declare const toSig: (sign: Sign) => Sig;
export declare const NoiseSchema: import("valibot").SchemaWithBrand<import("valibot").InstanceSchema<Uint8ArrayConstructor, Uint8Array>, "Noise">;
export type Noise = Output<typeof NoiseSchema>;
export declare const PackedNoiseSchema: import("valibot").SchemaWithBrand<import("valibot").SchemaWithBrand<import("valibot").StringSchema<string>, "Packed">, "PackedNoise">;
export type PackedNoise = Output<typeof PackedNoiseSchema>;
export declare const parseX: <S extends BaseSchema, V>(schema: S, value: NotPromise<V>, def?: Output<S>) => Output<S>;
type OnFail = <V>(issues: Issues, value: V, schema: BaseSchema) => void;
export declare const parseQ: <S extends BaseSchema, V, O = Output<S>>(schema: S, value: NotPromise<V>, onFail?: OnFail) => Q<O>;
export declare const decodeA: <S extends BaseSchema>(code: Uint8Array | ArrayBuffer, schema?: S) => Output<S>;
export declare const decodeS: <S extends BaseSchema>(str: Packed, schmea?: S) => Output<S>;
export declare const encodeA: <S extends BaseSchema>(value: S extends undefined ? unknown : Output<S>, schema?: S) => Uint8Array;
export declare const encodeS: <S extends BaseSchema>(value: S extends undefined ? unknown : Output<S>, schema?: S) => string & import("valibot").Brand<"Packed">;
export declare const outofQ: <T extends BaseSchema, O = Output<T>>(schema: T, value: unknown, then?: (value: O) => Q<boolean>, onFail?: OnFail) => Q<boolean>;
export declare const outofQA: <T extends BaseSchema, O = Output<T>>(schema: T, value: unknown, then?: (value: O) => Promise<Q<boolean>>, onFail?: OnFail) => Promise<Q<boolean>>;
export declare const outof: <T extends BaseSchema, V extends NotPromise<unknown>, O extends Output<T> = Output<T>>(schema: T, value: V, then?: (value: O) => Q<boolean>, onFail?: OnFail) => value is O;
export declare const outofX: <T extends BaseSchema, V extends NotPromise<unknown>, O extends Output<T> = Output<T>>(schema: T, value: V, onFail?: OnFail) => value is O;
export {};

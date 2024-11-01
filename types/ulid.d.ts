import type { ULID } from "./schema";
export declare const tsToA6: (ts: number) => Uint8Array;
export declare const tsOfA6: (ulid: ULID) => number;
export declare const getULID: (ts: number, rBytes: Uint8Array) => ULID;
export declare const genULID: (ts?: number) => Uint8Array & import("valibot").Brand<"ULID">;
export declare const tsULID: (ulid: ULID) => number;

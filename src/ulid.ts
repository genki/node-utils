import type {ULID} from "./schema";

// 6バイトのtimestamp文字列を生成
// NOTEシフト演算は32bitまでしか扱えない
const MAX_TS = 0xFFFFFFFFFFFF;
export const tsToA6 = (ts:number) => {
  if (ts < 0) ts = 0;
  else if (ts > MAX_TS) ts = MAX_TS;
  const bytes = new Uint8Array(6);
  for (let i = 5; i >= 0; i--) {
    bytes[i] = ts & 0xFFFF;
    ts /= 256;
  }
  return bytes;
};
// 先頭6バイトをtimestampとして取り出す
export const tsOfA6 = (ulid:ULID) => {
  let ts = 0;
  for (let i = 0; i < 6; i++) {
    ts *= 256;
    ts += ulid[i];
  }
  return ts;
}

// 時刻,乱数を指定して16バイトのULIDを生成する
// 乱数部分は先頭から10バイトだけ使用される
const RANDOM_BYTES = 10;
export const getULID = (ts:number, rBytes:Uint8Array):ULID => {
  // タイムスタンプ部分を生成（48ビット、6バイト）
  const ulid = new Uint8Array(16);
  ulid.set(tsToA6(ts));
  ulid.set(rBytes.slice(0, RANDOM_BYTES), 6);
  return ulid as ULID;
}

// ビット演算は最大32bitまでしか扱えない
export const genULID = (ts = Date.now()) => {
  // 乱数部分を生成（80ビット、10バイト）
  const rBytes = new Uint8Array(RANDOM_BYTES);
  crypto.getRandomValues(rBytes);
  return getULID(ts, rBytes);
}

export const tsULID = tsOfA6;

import type {Packed} from "./schema";

// pack bytes into valid UTF-16 string
//
// strategy:
//
// * using ESC as the escape character
//  * if there is ESC in the bytes, double it
// * if there is unmatched surrogate pair, mark it by the escape character
//
// 0x007f: escape, because it's rare but still only one utf-8 byte.
//   To escape itself, use 0x007f 0x08ff (two bytes utf-8)
// 0x0000->0x001f: converted to ESC + 0x0020->0x003f (two bytes utf-8)
// unmatched pairs: converted to ESC + (code-0xd800+0x0040) 0x0040->0x083f
//   (two-four bytes utf-8)
// BOM: ESC + 0x08fe (four bytes utf-8)
// SEP: ESC + 0x08fd (four bytes utf-8) // the separator for the packed data
//
// If the length of the bytes is odd, the last byte XX is put after the escape
// character as 0xFFXX.
//
// このロジックを変更するとhash値などが変わってしまうので注意
const SURROGATE_OFFSET = 0xD800 - 0x0040;
export const ESC = 0x007f;
export const SEP = '\u007f\u08FD';
const encode = (c:number) => {
  if (c >= 0xDC00 && c <= 0xDFFF) {
    // unmatched low surrogate
    return String.fromCharCode(ESC, c - SURROGATE_OFFSET);
  }
  // escape the BOM
  if (c === 0xFEFF) { // BOM
    return String.fromCharCode(ESC, 0x08FE);
  }
  // extra compaction against the stringify of the control characters
  if (c <= 0x001f) {
    return String.fromCharCode(ESC, c + 0x0020);
  }
  // double the escape character
  if (c === ESC) {
    return String.fromCharCode(ESC, 0x08FF);
  }
  // normal codepoint
  return String.fromCharCode(c);
};
export const packA = (bytes:Uint8Array) => {
  let code = '';
  let surrogate:number|undefined;
  let low = true;
  let c = 0;
  for (const b of bytes) {
    if (low) {
      c = b;
      low = false;
      continue;
    }
    c |= b << 8;
    low = true;
    if (surrogate !== undefined) {
      if (c >= 0xDC00 && c <= 0xDFFF) {
        // valid surrogate pair
        code += String.fromCharCode(surrogate, c);
        surrogate = undefined;
        continue;
      } else {
        // surrogate was unmatched high surrogate, so escape it
        code += String.fromCharCode(ESC, surrogate - SURROGATE_OFFSET);
        surrogate = undefined;
      }
    }
    if (c >= 0xD800 && c <= 0xDBFF) {
      surrogate = c;
      continue;
    }
    code += encode(c);
  }
  if (surrogate) {
    const x = surrogate - SURROGATE_OFFSET;
    code += String.fromCharCode(ESC, x);
  }
  if (!low && bytes.length > 0) {
    code += encode(c) + String.fromCharCode(ESC);
  }
  return code as Packed;
};

// unpack encoded valid UTF-16 string into Uint8Array
export const unpackA = (code:Packed) => {
  const bytes = new Uint8Array(code.length*2);
  let j = 0;
  let escaped = false;
  for (const s of code) {
    const c = s.charCodeAt(0);
    if (!escaped) {
      if (c === ESC) {
        escaped = true;
      } else {
        // normal codepoint
        bytes[j++] = c & 0xff;
        bytes[j++] = c >>> 8;
        if (c >= 0xD800 && c <= 0xDBFF) {
          const d = s.charCodeAt(1);
          bytes[j++] = d & 0xff;
          bytes[j++] = d >>> 8;
        }
      }
      continue;
    }
    // escaped character
    if (c < 0x0040) {
      // restore the control characters
      bytes[j++] = (c - 0x0020) & 0xff;
      bytes[j++] = c >>> 8;
    } else if (c <= 0xDFFF - SURROGATE_OFFSET) {
      // restore the escaped unmatched surrogate
      const x = c + SURROGATE_OFFSET;
      bytes[j++] = x & 0xff;
      bytes[j++] = x >>> 8;
    } else if (c === 0x08FE) { // restore the BOM
      bytes[j++] = 0xFF;
      bytes[j++] = 0xFE;
    } else { // restore the ESC
      bytes[j++] = ESC;
      j++;
    }
    escaped = false;
  }
  // if ended while escaped, the length is odd
  if (escaped) j--;
  return bytes.subarray(0, j);
};

// SEPで結合/分割する
// NOTE: 階層を持つことはなくflatになる
export const joinPacked = (ary:Packed[]) => ary.join(SEP) as Packed;
export const splitPacked = (code:Packed, limit?:number) =>
  code.split(SEP, limit) as Packed[];

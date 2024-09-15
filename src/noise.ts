// The noise is a kind of view of array buffer.
// バイトオーダーはリトルエンディアンとする
// * MSBが最初のバイトの最上位ビット
// * LSBは最後のバイトの最下位ビット
// eb (effective bits) はMSB側からのビット数を示す
// bit indexはMSB(=0)側からのビット位置とする
import type {Noise, PackedNoise} from './schema';
import {packA, unpackA} from './string';
import type {Upto} from './types';

export const MIN_EB = 2;
export const MAX_EB = 32 as const; // noiseのうちmeshで使用する範囲
export const NOISE_BYTES = 16;     // 128 bits
export const NOISE_FP_SIZE = 6;    // 48 bits for fingerprint
export const NOISE_BITS = NOISE_BYTES*8; // 128 bits
export const NOISE_DIST_MAX = 2**MAX_EB;

if (NOISE_DIST_MAX > Number.MAX_SAFE_INTEGER) {
  throw Error("MAX_EB is too large");
}

export type EB = Upto<typeof MAX_EB>;

// バッファからnoiseを切り出す. cloneを期待する場合はdupNoiseを使うこと
export const noiseCode = (code: Uint8Array|number[]):Noise => {
  if (code instanceof Uint8Array) {
    return code.subarray(0, NOISE_BYTES) as Noise;
  }
  const noise = new Uint8Array(NOISE_BYTES);
  noise.set(code.slice(0, NOISE_BYTES));
  return noise as Noise;
};
export const dupNoise = (noise:Noise) => structuredClone(noise) as Noise;

export const noiseLen = (noise:Noise) => {
  return noise.length;
};

// 任意のデータからハッシュ値を計算してnoiseを得る
export const noiseFor = async (data:ArrayBuffer):Promise<Noise> => {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return noiseCode(new Uint8Array(digest));
};

// generate the noise at random.
export const genNoise = ():Noise => {
  const noise = new Uint8Array(NOISE_BYTES);
  crypto.getRandomValues(noise);
  return noiseCode(noise);
}

export const packedUUID = () => packA(genNoise()) as PackedNoise;

export const zeroNoise = ():Noise => new Uint8Array(NOISE_BYTES) as Noise;

// get the bit of the noise at the index.
// indexはMSB(=0)側からのビット位置である事に留意
export const noiseBit = (noise:Noise, index:number) => {
  const i = index >> 3, j = index & 0b111;
  return (noise[i] << j) & 0x80 ? 1 : 0;
};

// 指定した位置のビット値を設定する
export const noiseSet = (noise:Noise, index:number, bit:number) => {
  const i = index >> 3, j = index & 0b111;
  if (i >= noise.length) {
    const noise0 = noise;
    noise = new Uint8Array(i + 1) as Noise;
    noise.set(noise0);
  }
  const mask = 1 << j;
  const code = noise[i] ?? 0;
  noise[i] = bit ? code | mask : code & ~mask;
  return noise;
};

// ビット反転したnoiseを得る
export const noiseNeg = (noise:Noise) => {
  const neg = new Uint8Array(NOISE_BYTES);
  for (let i = 0; i < NOISE_BYTES; i++) neg[i] = ~noise[i];
  return neg as Noise;
};

// MSB側から指定したビット数の部分byte列 (slot) を取り出す
// slotはLSBが1で終わり、LSBはデータに含まない
// if you extract the bits from the slot, you must omit the MSB.
export const noiseSlot = (noise:Noise, bits:number):Noise => {
  const bytes = bits >>> 3, remain = bits & 0b111;
  const slot = new Uint8Array((bits + 8) >>> 3);
  let j = 0;
  for (let i = 0; i < bytes; i++) slot[j++] = noise[i];
  if (remain) {
    const lsb = 0x80 >>> remain, mask = 0x100 - lsb;
    slot[j] = noise[bytes] & mask | lsb;
  } else {
    slot[j] = 0x80; // the LSB
  }
  return slot as Noise;
};

// returns the bitwise LSB index of the slot from the MSB.
export const slotLSB = (slot:Noise) => {
  let i = 0;
  const code = slot[slot.length - 1];
  if (code === 0) {
    if (slot.length === NOISE_BYTES) return NOISE_BITS + 1;
    throw Error(`Invalid slot: ${JSON.stringify(slot)}`);
  }
  for(; i <= 0b111; i++) if (code & (1 << i)) break; // find the MSB
  return (7 - i) + (slot.length - 1) * 8;
};

// slot LSB情報を含むhex文字列を得る
// 単純にhex化するとLSB情報が失われて復元できないのでlsbを含める必要がある
export const slotToHex = (slot:Noise, bits?:number) => {
  if (bits) slot = noiseSlot(slot, bits);
  let hex = '';
  for (let i = 0; i < slot.length; i++) {
    const code = slot[i]; // 8bit
    hex += code.toString(16).padStart(2, "0");
  }
  return hex;
};

// hex化されたslotをdecodeする
export const slotForHex = (hex:string) => {
  const slot = new Uint8Array((hex.length + 1) >>> 1);
  for (let i = 0; i < slot.length; i++) {
    const j = i * 2;
    slot[i] = parseInt(hex.slice(j, j + 2), 16);
  }
  return slot as Noise;
};

export const noiseToHex = (noise:Noise) => {
  let hex = '';
  for (let i = 0; i < noise.length; i++) {
    const code = noise[i]; // 8bit
    hex += code.toString(16).padStart(2, "0");
  }
  return hex;
};

// returns the binary buf of the slot.
// 二進文字列はLSBビット情報を必要としないので出力にLSBは含まない
export const slotToBin = (slot:Noise, bits?:number) => {
  if (!bits) bits = slotLSB(slot) - 1;
  let bin = '';
  for (let i = 0; i < bits; i++) bin += noiseBit(slot, i) ? '1' : '0';
  return bin;
};

// check if two noises are same for the given bits from the MSB.
export const noiseSame = (n1:Noise, n2:Noise, bits:number) => {
  const bytes = bits >>> 3, remain = bits & 0b111;
  for (let i = 0; i < bytes; i++) if (n1[i] !== n2[i]) return false;
  if (remain) {
    const mask = 0xff << (8 - remain);
    if ((n1[bytes] ^ n2[bytes]) & mask) return false;
  }
  return true;
};

// 1 byteのビット順を逆転
const byteReverse = (x:number) => {
  x = ((x >>> 4) & 0x0F) | ((x << 4) & 0xF0);
  x = ((x >>> 2) & 0x33) | ((x << 2) & 0xCC);
  x = ((x >>> 1) & 0x55) | ((x << 1) & 0xAA);
  return x;
}

// bit-wiseにnoiseをMSB側とLSB側を反転させる
export const noiseReverse = (noise:Noise) => {
  const reversed = new Uint8Array(NOISE_BYTES);
  for (let i = 0; i < NOISE_BYTES; i++) {
    reversed[i] = byteReverse(noise[NOISE_BYTES - i - 1]);
  }
  return reversed as Noise;
}

// indexはMSB側からのビット位置である事に留意
export const noiseSameAt = (n1:Noise, n2:Noise, index:number) => {
  const i = index >> 3, j = index & 0b111;
  return !!(~(n1[i] ^ n2[i]) & (1 << (0b111 - j)));
};

// returns count of bits if a and b are same from the MSB.
// MSBから一致するbit数を返す. MSBから不一致なら0
// 全部一致の場合はNOISE_BITSを返す
export const noiseRank = (n1:Noise|PackedNoise, n2:Noise) => {
  if (typeof n1 === 'string') n1 = unpackNoise(n1);
  for (let i = 0; i < NOISE_BYTES; i++) {
    const c = n1[i] ^ n2[i]; // 相違bits
    if (c) for (let j = 0; j < 8; j++) if ((c << j) & 0x80) return (i<<3) + j;
  }
  return NOISE_BITS;
};

// returns bigint of the noise.
export const noiseValue = (noise:Noise) => {
  let value = BigInt(noise[0]);
  for (let i = 1; i < NOISE_BYTES; i++) {
    value *= 256n;
    value += BigInt(noise[i]);
  }
  return value;
};

export const NoiseValueMax = noiseValue(noiseNeg(zeroNoise()));

export const noiseForValue = (value:bigint) => {
  const noise = new Uint8Array(NOISE_BYTES);
  for (let i = NOISE_BYTES - 1; i >= 0; i--) {
    noise[i] = Number(value & 0xffffn);
    value >>= 8n;
  }
  return noise as Noise;
};

// noiseの編集距離を返す
//   0: 完全一致
// > 0: 編集距離
// max: 部分一致 (bits < NOISE_BITS)
export const noiseEdit = (n1:Noise, n2:Noise, bits:number = NOISE_BITS) => {
  if (n1 === n2) return 0;
  let dist = 0;
  for (let i = 0; i < bits; i++) {
    dist += noiseSameAt(n1, n2, i) ? 0 : 1;
  }
  if (dist === 0 && bits < NOISE_BITS) return NOISE_BITS;
  return dist;
};

// noiesの距離を返す
// 基本的にはvalue化した値の距離だが、bitsで指定した範囲で一致を見る
// ただし各bitの距離は(1<<`MSBからの距離(0 origin)`)を乗じる
// bitsで指定した範囲での距離の大小関係がbitsを増やした場合でも保存されること
// bitsに関してはMAX_EBより大きな桁数は整数の精度範囲上考慮しない
export const noiseDist = (n1:Noise, n2:Noise, bits:EB = MAX_EB) => {
  if (n1 === n2) return 0;
  let dist = 0;
  for (let i = 0; i < bits; i++) {
    dist += noiseSameAt(n1, n2, i) ? 0 : 2**(MAX_EB - 1 - i);
  }
  return Math.min(dist, NOISE_DIST_MAX);
};

const BIT_COUNTS = [...Array(256)].map((_,v) => {
  let count = 0;
  for (let i = 0; i < 8; i++) count += v >>> i & 1;
  return count;
});

export const noiseCount = (noise:Noise) => {
  let count = 0;
  for (let i = 0; i < NOISE_BYTES; i++) count += BIT_COUNTS[noise[i]];
  return count;
};

export const packNoise = (noise:Noise) => packA(noise) as PackedNoise;
export const unpackNoise = (packed:PackedNoise) => unpackA(packed) as Noise;

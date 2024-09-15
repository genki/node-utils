import { describe, test, expect } from 'vitest';
import {
  genNoise, noiseBit, noiseSame, noiseFor, noiseCode, noiseLen, noiseSlot,
  slotToHex, noiseSet, slotLSB, noiseRank, noiseSameAt, noiseValue,
  noiseForValue, slotToBin, noiseDist, MAX_EB, slotForHex, dupNoise,
  NOISE_BYTES, NOISE_BITS, noiseReverse,
} from './noise';

const countBits = (byte: number) => {
  let count = 0;
  for (let i = 0; i < 8; i++) {
    if ((byte >>> i) & 1) count++;
  }
  return count;
};

describe('Noise', () => {
  test('genNoise', () => {
    const noise = genNoise();
    expect(noise).toBeInstanceOf(Uint8Array);
    expect(noiseLen(noise)).toBe(16);
    expect(countBits(0b1011_1001)).toBe(5);
  });

  test('noiseFor', async () => {
    const a = new Uint8Array([0b1011_1001]);
    const aa = new Uint8Array(16);
    aa.set(a);
    const noise = await noiseFor(new Uint8Array([0b1011_1001]));
    expect(noise).toBeInstanceOf(Uint8Array);
  });

  test('noiseBit', () => { //  0  3 4  7
    const noise = noiseCode([0b1011_1001]);
    expect(slotToBin(noise, 8)).toBe('10111001');
    expect(noiseBit(noise, 0)).toBe(1);
    expect(noiseBit(noise, 1)).toBe(0);
    expect(noiseBit(noise, 3)).toBe(1);
    expect(noiseBit(noise, 4)).toBe(1);
    expect(noiseBit(noise, 7)).toBe(1);
    expect(noiseBit(noise, 8)).toBe(0);
  });

  test('noiseSet', () => {
    const noise = noiseCode([0b1011_1001]);
    expect(noiseSet(noise, 0, 0)).toStrictEqual(noiseCode([0b1011_1000]));
    expect(noiseSet(noise, 1, 1)).toStrictEqual(noiseCode([0b1011_1010]));
    expect(noiseSet(noise, 4, 0)).toStrictEqual(noiseCode([0b1010_1010]));
    expect(noiseSet(noise, 7, 0)).toStrictEqual(noiseCode([0b0010_1010]));
    expect(noiseSet(noise, 8, 1)).
      toStrictEqual(noiseCode([0b0010_1010, 0b0000_0001]));
  });

  test('noiseSame', () => {
    //                      7  4 3  0 + 1
    const n1 = noiseCode([0b0110_1001]);
    const n2 = noiseCode([0b0110_1001, 0b0101_1001]);
    const n3 = noiseCode([0b0110_1101]);
    expect(noiseSame(n1, n2, 8)).toBe(true);
    expect(noiseSame(n1, n2, 10)).toBe(false);
    expect(noiseSame(n1, n3, 8)).toBe(false);
    expect(noiseSame(n1, n3, 5)).toBe(true);
    expect(noiseSame(n1, n3, 6)).toBe(false);
  });

  test('noiseSlot', () => {
    const n1 = noiseCode([0b0110_1001, 0b0101_1001]);
    const n2 = noiseCode([0b0110_1001, 0b0100_1001]);
    expect(noiseSlot(n1, 15).length).toBe(2);
    expect(noiseSlot(n1, 14)[1]).toBe(0b0101_1010); // the LSB = 1
    expect(noiseSlot(n1, 16).length).toBe(3);
    expect(noiseSlot(n1, 16)[2]).toBe(0b1000_0000); // the LSB = 1
    expect(noiseSlot(n1, 11)).toStrictEqual(noiseSlot(n2, 11));
    expect(noiseSlot(n1, 12)).not.toStrictEqual(noiseSlot(n2, 12));
    expect([...noiseSlot(n1, 0)]).toStrictEqual([0b1000_0000]);
  });

  test('slotToHex', () => {
    const noise = noiseCode([0b0110_1001, 0b0101_1001]);
    expect(slotToHex(noiseSlot(noise, 0))).toBe('80');
    expect(slotToHex(noiseSlot(noise, 8))).toBe('6980');
    expect(slotToHex(noiseSlot(noise, 9))).toBe('6940');
    expect(slotToHex(noiseSlot(noise, 10))).toBe('6960');
    expect(slotToHex(noiseSlot(noise, 16))).toBe('695980');
    expect(slotForHex('695980')).toStrictEqual(noiseSlot(noise, 16));
  });

  test('slotMSB', () => {
    const noise = noiseCode([0b0110_1001, 0b0101_1001]);
    expect(slotLSB(noiseSlot(noise, 0))).toBe(0);
    expect(slotLSB(noiseSlot(noise, 8))).toBe(8);
    expect(slotLSB(noiseSlot(noise, 9))).toBe(9);
    expect(slotLSB(noiseSlot(noise, 10))).toBe(10);
    expect(slotLSB(noiseSlot(noise, 16))).toBe(16);
  });

  test('noiseRank', () => {
    const n0 = noiseCode([0b0110_1001, 0b0101_1001]);
    const n1 = noiseCode([0b0110_1001, 0b0100_1001]);
    const n2 = noiseCode([0b0110_1000, 0b0100_1001]);
    const n3 = noiseCode([0b1110_1000, 0b0100_1001]);
    expect(noiseRank(n0, n1)).toBe(11);
    expect(noiseRank(n0, n0)).toBe(128);
    expect(noiseRank(n0, n2)).toBe(7);
    expect(noiseRank(n2, n3)).toBe(0);
  });

  test('noiseSameAt', () => {
    const n0 = noiseCode([0b0110_1001, 0b0101_1001]);
    const n1 = noiseCode([0b0110_1001, 0b0100_1001]);
    expect(noiseSameAt(n0, n1, 0)).toBe(true);
    expect(noiseSameAt(n0, n1, 9)).toBe(true);
    expect(noiseSameAt(n0, n1, 11)).toBe(false);
  });

  test('noiseValue', () => {
    for (let i = 0n; i < 10n; i++) {
      const noise = noiseForValue(i);
      const value = noiseValue(noise);
      expect(value).toStrictEqual(i);
    }
  });

  test('noiseDist', () => {
    const n0 = noiseCode([0b0110_1001, 0b0101_1001]);
    const n1 = noiseCode([0b0110_1001, 0b0100_1001]);
    const n2 = noiseCode([0b1110_1001, 0b0100_1001]);
    expect(noiseDist(n0, n0)).toBe(0);
    expect(noiseDist(n1, n2)).toBe(2**(MAX_EB - 1 - 0));
    expect(noiseDist(n0, n1)).toBe(2**(MAX_EB - 1 - 11));
    //expect(noiseDist(n0, n1, 4)).toBe(NOISE_DIST_MAX);
    expect(noiseDist(n0, n1, 4)).toBe(0);
    const nX = genNoise();
    const nY = dupNoise(nX);
    expect(noiseDist(nX, nY)).toBe(0);
    //expect(noiseDist(nX, nY)).toBe(NOISE_DIST_MAX);
    nY[3] ^= 0x1; // 31-th bit from MSB in 0-origin
    expect(noiseSame(nX, nY, NOISE_BITS)).toBe(false);
    expect(noiseDist(nX, nY)).toBe(1);
    for (let i = 0; i < 100; ++i) {
      const n1 = genNoise(), n2 = genNoise();
      const d1 = noiseDist(n1, n2);
      const d2 = noiseDist(n2, n1);
      expect(d1).toBe(d2);
    }
  });

  test('noiseDist values', () => {
    const n0 = noiseCode([0b1000_0000]);
    const n1 = noiseCode([0b1100_0000]);
    const n2 = noiseCode([0b1110_0000]);
    const d1 = noiseDist(n0, n1);
    const d2 = noiseDist(n0, n2);
    expect(d2).greaterThan(d1);
  });

  test('noise reverse', () => {
    const noise = genNoise();
    noise[0] = 0b1010_1010;
    const rev = noiseReverse(noise);
    expect(rev[NOISE_BYTES - 1]).toBe(0b0101_0101);
    expect(noiseSame(noise, rev, NOISE_BITS)).toBe(false);
    const revrev = noiseReverse(rev);
    expect(noiseSame(noise, revrev, NOISE_BITS)).toBe(true);
  });
});

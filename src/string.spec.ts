import {test, expect, expectTypeOf} from 'vitest';
import {SEP, joinPacked, packA, splitPacked, unpackA} from './string';
import {Packed} from './schema';
import {Brand} from 'valibot';

test("pack/unpack", () => {
  const a = new Uint8Array([66, 216, 183, 223, 206, 145, 182, 91]);
  const packed = packA(a);
  expect(packed).toBe('𠮷野家');
  expect(typeof packed).toBe('string');
  expect(unpackA(packed)).toStrictEqual(a);
});

test("random pack/unpack of even array", () => {
  const a = new Uint8Array(8);
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  for (let i = 0; i < 1000; i++) {
    crypto.getRandomValues(a);
    const packed = packA(a);
    const code = enc.encode(packed);
    const decoded = dec.decode(code);
    try {
      expect(packed.split(SEP).length).toBe(1);
      expect(unpackA(decoded as Packed)).toStrictEqual(a);
    } catch (e) {
      console.log(i, 'a ->', [...a].map(
        i => i.toString(16).padStart(2,"0")).join(" "));
      console.log('packed ->', packed.split("").map(
        c => c.charCodeAt(0).toString(16).padStart(4, "0")).join(" "));
      throw e;
    }
  }
});

test("random pack/unpack of odd array", () => {
  const a = new Uint8Array(7);
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  for (let i = 0; i < 1000; i++) {
    crypto.getRandomValues(a);
    const packed = packA(a);
    const code = enc.encode(packed);
    const decoded = dec.decode(code);
    try {
      expect(packed.split(SEP).length).toBe(1);
      expect(unpackA(decoded as Packed)).toStrictEqual(a);
    } catch (e) {
      console.log(i, 'a ->', [...a].map(
        i => i.toString(16).padStart(2,"0")).join(" "));
      console.log('packed ->', packed.split("").map(
        c => c.charCodeAt(0).toString(16).padStart(4, "0")).join(" "));
      throw e;
    }
  }
});

test("space efficient", () => {
  const a = new Uint8Array(65536);
  crypto.getRandomValues(a);
  const packed = packA(a);
  // 0xD800-0xDFFF = 2048. 2048/65536 = 0.03125
  // これがおよそ倍になるので0.0625付近になる
  // 余裕を見て1.07倍以下になることを確認する
  expect(packed.length*2/a.length).toBeLessThan(1.07);
});

test("join/split", () => {
  const ary = ['𠮷野家', '𠮷野家', '𠮷野家'];
  const packed = packA(new Uint8Array([66, 216, 183, 223, 206, 145, 182, 91]));
  const code = joinPacked(ary.map(() => packed));
  expect(code).toBe('𠮷野家' + SEP + '𠮷野家' + SEP + '𠮷野家');
  expect(splitPacked(code)).toStrictEqual(ary);
});

test("type check", () => {
  expect(Packed("test")).toBe("test");
  expect(() => Packed("test\u007f\u0855")).toThrow();
  expectTypeOf(Packed("test")).toEqualTypeOf<"test"&Brand<"Packed">>();
});

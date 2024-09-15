import { test, expect } from "vitest";
import {
  encrypt, decrypt, genCryptKeyPair, encipher, decipher, genSignKeyPair, sign,
  verify, encipherRaw, decipherRaw
} from './pki';
import type {Packed} from './schema';

test('sign/verify', async () => {
  const {pk, sk} = await genSignKeyPair();
  const msg = 'hello world!';
  const sig = await sign(sk, msg);
  expect(typeof sig).toBe('string');
  const ok = await verify(pk, msg, sig);
  expect(ok).toBe(true);
});

test('encrypt/decrypt', async () => {
  const {pk, sk} = await genCryptKeyPair();
  expect(typeof pk).toBe('string');
  expect(typeof sk).toBe('string');

  //const msg = 'hello world!';
  const msg = `
  {"type":"CANDIDATE","payload":{"candidate":{"candidate":"candidate:3940086404 1 udp 33565183 2a01:4ff:1f0:e1f6::1 62554 typ relay raddr 2405:6580:100:3800:4d23:314a:76b7:1bf1 rport 49926 generation 0 ufrag rrTy network-cost 999","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"rrTy"},"type":"data","connectionId":"dc_i8mvcc8nje"},"dst":"7cba275d-a79b-4fd8-a435-e5509e8c86ed","src":"0df459f8-286e-4e4d-aa07-5763fa0d3e05"}`;
  const cipher = await encrypt(pk, msg);
  expect(typeof cipher).toBe('object');
  const plain = await decrypt(sk, cipher);
  expect(plain).toBe(msg);
});

test('enciher/decipher', async () => {
  const msg = 'hello world!' as Packed;
  const c = await encipher(msg);
  expect(typeof c).toBe('object');
  const p = await decipher(c);
  expect(p).toBe(msg);
});

test('enciher/decipher raw', async () => {
  const enc = new TextEncoder();
  const msg = enc.encode('hello world!');
  const c = await encipherRaw(msg);
  expect(typeof c).toBe('object');
  const p = await decipherRaw(c);
  expect(p).toStrictEqual(msg);
});

import {describe, expect, expectTypeOf, test} from "vitest";
import {array8n, outof, parseX} from "./schema";
import {array, number, string} from "valibot";

describe("schema", () => {
  test("outof", async () => {
    const foo = [1, 2, 3];
    expect(outof(array(number()), foo)).toBe(true);
    expect(outof(array(string()), foo)).toBe(false);
    const bar = [1, 2, "3"] as unknown;
    if (outof(array(string()), bar)) {
      expectTypeOf(bar).toEqualTypeOf<string[]>();
    }
  });

  test("array8n", async () => {
    const a = new Uint8Array([1, 2, 3]);
    expect(outof(array8n(3), a)).toBe(true);
    const ab = new ArrayBuffer(3);
    expect(outof(array8n(3), ab)).toBe(true);
    const u = parseX(array8n(3), ab);
    expectTypeOf(u).toEqualTypeOf<Uint8Array>();
  });
});

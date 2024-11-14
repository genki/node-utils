import {describe, expect, expectTypeOf, test} from "vitest";
import {outof} from "./schema";
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
});

import {describe, expect, expectTypeOf, test} from "vitest";
import {P, Q, X} from "./misc";

describe("misc", () => {
  test("X", async () => {
    expect(X(undefined)).toBe(false);
    expect(X(0)).toBe(true);
    // @ts-expect-error
    X(Promise.resolve(0));
    // @ts-expect-error
    const x:X<number> = Promise.resolve(0);
    // @ts-expect-error
    const y:X<number|undefined> = undefined;
  });

  test("Q", async () => {
    const q = Q<number>();
    expect(q).toBe(undefined);
    expect(Q(0, 1)).toBe(0);
    expect(Q(undefined, 1)).toBe(1);
    expect(Q(false, true)).toBe(false);
    expect(Q(0, 1)).toBe(0);
    // @ts-expect-error
    Q(0, "str");
    expectTypeOf(Q<number>()).toEqualTypeOf<number|undefined>();
  });

  test("P", async () => {
    expect(P(0)).toBe(false);
    expect(P(Promise.resolve(0))).toBe(true);
    // @ts-expect-error
    const x:P<number> = 0;
    expectTypeOf<P<number>>().toEqualTypeOf<Promise<number>>();
  });
});

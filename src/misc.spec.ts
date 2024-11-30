import {describe, expect, expectTypeOf, test} from "vitest";
import {P, Q, X, QX, touch} from "./misc";

describe("misc", () => {
  test("X", async () => {
    expect(X(undefined)).toBe(false);
    expect(X(Q(null))).toBe(false);
    // @ts-expect-error no possibility of undefined
    expect(X(0)).toBe(true);
    expect(X(Q(0))).toBe(true);
    // @ts-expect-error promise is not exist yet.
    X(Promise.resolve(0));
    // @ts-expect-error
    const x:X<number|undefined> = Promise.resolve(0);
    // @ts-expect-error
    const y:X<number|undefined> = undefined;
    expectTypeOf<X<number|undefined>>().toEqualTypeOf<number>();
    expectTypeOf<X<number>>().toEqualTypeOf<never>();
    // @ts-expect-error
    const z:X<number> = 0;
    touch(x, y, z);
    const foo = async <T extends Promise<number|undefined>>(x:T) => {
      const y = await x;
      expectTypeOf(X(y)).toEqualTypeOf<boolean>();
      if (X(y)) {
        if (y === 5) return;
      }
    }
    touch(foo);

    // check the real type including null or undefined
    type JSONSerializable = string|number|boolean|null|undefined|
      JSONSerializable[]|{[key:string]:JSONSerializable};
    const bar = 1 as Q<JSONSerializable>;
    if (X(bar)) {
      expectTypeOf(bar).toEqualTypeOf<X<JSONSerializable>>();
    }
  });

  test("QX", async () => {
    expectTypeOf<QX<number>>().toEqualTypeOf<never>();
    expectTypeOf<QX<number|undefined>>().toEqualTypeOf<number|undefined>();
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
    expectTypeOf(Q(1)).toEqualTypeOf<number|undefined>();
    expectTypeOf(Q<string>()).toEqualTypeOf<string|undefined>();
    expectTypeOf(Q()).toEqualTypeOf<unknown>();
  });

  test("P", async () => {
    expect(P(0)).toBe(false);
    expect(P(Promise.resolve(0))).toBe(true);
    expectTypeOf<P<number>>().toEqualTypeOf<Promise<number>>();
    // @ts-expect-error
    const x:P<number> = 0;
    expectTypeOf<P<number>>().toEqualTypeOf<Promise<number>>();
  });
});

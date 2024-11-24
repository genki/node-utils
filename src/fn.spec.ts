import {describe, expect, expectTypeOf, test, vi} from "vitest";
import {marg, memoize, setarg} from "./fn";

describe("fn", () => {
  const add = (a:number, b:number) => a + b;

  test("setarg", () => {
    const add2 = setarg(add, 1, 2);
    expect(add2(1)).toBe(3);
    expectTypeOf(add2).toEqualTypeOf<(a:number) => number>();

    // @ts-expect-error
    setarg(add, 0, "str");
  });

  test("setarg promise", async () => {
    const add2 = setarg(add, 1, Promise.resolve(2));
    expect(await add2(1)).toBe(3);
  });

  test("setarg func value", async () => {
    const add2 = setarg(add, 1, () => 2);
    expect(add2(1)).toBe(3);
  });

  test("setarg async func", async () => {
    const add2 = setarg(add, 1, async () => 2);
    expect(await add2(1)).toBe(3);
    expectTypeOf(add2).toEqualTypeOf<(a:number) => Promise<number>>();
  });

  test("marg", () => {
    const addX = marg(add, 0, (str:string) => parseInt(str));
    expect(addX("1", 2)).toBe(3);
    expectTypeOf(addX).toEqualTypeOf<(a:string, b:number) => number>();
  });

  test("marg async", async () => {
    const addA = marg(add, 0, async (str:string) => parseInt(str));
    expect(await addA("1", 2)).toBe(3);
    expectTypeOf(addA).toEqualTypeOf<(a:string, b:number) => Promise<number>>();
  });

  const addOpt = (a:number, b:number = 0) => a + b;
  test("marg opt", () => {
    const add3 = marg(addOpt, 1, (str:void|string) => str ? parseInt(str) : 3);
    expectTypeOf(add3).toEqualTypeOf<(a:number, b:string|void) => number>();
    expect(add3(1)).toBe(4);
  });

  test("memoize", () => {
    const add = vi.fn((a:number, b:number) => a + b);
    const addM = memoize(add);
    expect(addM(1, 2)).toBe(3);
    expect(addM(1, 2)).toBe(3);
    expect(add).toHaveBeenCalledTimes(1);
    expect(addM(1, 4)).toBe(5);
    expect(add).toHaveBeenCalledTimes(2);
  });
});

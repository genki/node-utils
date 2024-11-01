import {describe, expect, expectTypeOf, test} from "vitest";
import {marg, setarg} from "./fn";

describe("fn", () => {
  const add = (a:number, b:number) => a + b;

  test("setarg", () => {
    const add2 = setarg(add, 1, 2);
    expect(add2(1)).toBe(3);
    expectTypeOf(add2).toEqualTypeOf<(a:number) => number>();

    // @ts-expect-error
    setarg(add, 0, "str");
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
});

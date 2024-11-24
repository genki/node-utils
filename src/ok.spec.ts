import {describe, expectTypeOf, test} from "vitest";
import {NO, OK, Ok} from "./ok";

describe("ok", () => {
  test("ok", () => {
    const foo = () => {
      const value = "foo"
      const k = Ok({value});
      return k;
    }
    const x = foo();
    if (Ok(x)) {
      expectTypeOf(x).toEqualTypeOf<{value:string}&OK<true>>();
      x.value;
    } else {
      expectTypeOf(x).toEqualTypeOf<never>();
    }
    const even = (x:number) => x % 2 === 0 ? Ok({x}) : NO
    const y = even(2);
    expectTypeOf(y).toEqualTypeOf<{x:number}&OK<true>|typeof NO>();
    expectTypeOf(y).toEqualTypeOf<{x:number}&OK<true>|OK<false>>();
    if (Ok(y)) {
      expectTypeOf(y).toEqualTypeOf<{x:number}&OK<true>>();
      y;
    }
  })

  test("NO", () => {
    expectTypeOf<OK<false>>().toEqualTypeOf(NO);
  });
});

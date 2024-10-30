import {describe, expectTypeOf, test} from "vitest";
import {Compact} from "./types";

describe("types", () => {
  test("Compact", () => {
    const obj = {a:1, b:"foo", c:undefined};
    type C = Compact<typeof obj>;
    expectTypeOf<C>().toEqualTypeOf<{a:number,b:string}>();
  });
});

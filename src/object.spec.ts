import {describe, expectTypeOf, test} from "vitest";
import {valuesOf} from "./object";

describe("object", () => {
  test("valuesOf", () => {
    const obj = {a:1, b:2, c:3} as const;
    const values = valuesOf(obj);
    expectTypeOf(values).toEqualTypeOf<(1|2|3)[]>();
  });
});

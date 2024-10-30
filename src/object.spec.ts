import {describe, expect, expectTypeOf, test} from "vitest";
import {entries, entriesX, valuesOf} from "./object";

describe("object", () => {
  test("valuesOf", () => {
    const obj = {a:1, b:2, c:3} as const;
    const values = valuesOf(obj);
    expectTypeOf(values).toEqualTypeOf<(1|2|3)[]>();

    type Foo = {a:number}|{a:string};
    const objUnion:Foo = {a:"test"} as const;
    const values1 = valuesOf(objUnion);
    expect(values1).toEqual(["test"]);
  });

  test("entries", () => {
    const obj = {a:1, b:2, c:3} as const;
    const ents = entries(obj);
    expectTypeOf(ents).toEqualTypeOf<readonly ["a"|"b"|"c", 1|2|3][]>();
    expect(ents).toEqual([["a", 1], ["b", 2], ["c", 3]]);
  });

  test("entriesX", () => {
    const obj = {a:1, b:2, c:undefined} as const;
    const ents = entriesX(obj);
    expectTypeOf(ents).toEqualTypeOf<readonly ["a"|"b", 1|2][]>();
    expect(ents).toEqual([["a", 1], ["b", 2]]);
    for (const [k, v] of ents) {
      expectTypeOf(k).toEqualTypeOf<"a"|"b">();
      expectTypeOf(v).toEqualTypeOf<1|2>();
    }
    const foo:Partial<Record<string,number>> = {a:1, b:2, c:undefined};
    const ents1 = entriesX(foo);
    expectTypeOf(ents1).toEqualTypeOf<readonly [string, number][]>();
  })
});

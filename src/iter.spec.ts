import {describe, expect, test} from "vitest";
import {groupBy, same} from "./iter";
import {bind} from "./fn";

describe("iter", () => {
  test("same", () => {
    const foo = {name:"foo", age:10};
    const bar = {name:"bar", age:20};
    const baz = {name:"baz", age:20};
    expect(same("age")).toBe(true);
    expect(same("age", foo)).toBe(true);
    expect(same("age", foo, bar)).toBe(false);
    expect(same("age", bar, baz)).toBe(true);
    expect(same("age", foo, bar, baz)).toBe(false);
    expect(same("name", foo, bar)).toBe(false);
    const cmpLen = (a:string, b:string) => a.length === b.length;
    expect(bind(same, cmpLen)("name", foo, bar)).toBe(true);
  });

  test("groupBy", () => {
    const foo = {name:"foo", age:10};
    const bar = {name:"bar", age:20};
    const baz = {name:"baz", age:20};
    const qux = {name:"qux", age:10};
    const map = groupBy([foo, bar, baz, qux], "age");
    expect(map).toEqual({
      10: [foo, qux],
      20: [bar, baz],
    });
    const map2 = groupBy([foo, bar, baz, qux], "name");
    expect(map2).toEqual({
      foo: [foo],
      bar: [bar],
      baz: [baz],
      qux: [qux],
    });
  });
});

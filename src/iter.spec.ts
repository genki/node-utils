import {describe, expect, test} from "vitest";
import {same} from "./iter";
import {bind} from "./fn";

describe("iter", () => {
  test("same", () => {
    const foo = {name:"foo", age:10};
    const bar = {name:"bar", age:20};
    const baz = {name:"baz", age:20};
    expect(same("age", foo, bar)).toBe(false);
    expect(same("age", bar, baz)).toBe(true);
    expect(same("name", foo, bar)).toBe(false);
    const cmpLen = (a:string, b:string) => a.length === b.length;
    expect(bind(same, cmpLen)("name", foo, bar)).toBe(true);
  });
});

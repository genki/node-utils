import {describe, expectTypeOf, test} from "vitest";
import {Compact, InsertAt, RemoveAt, ReplaceAt, TupleSplit} from "./types";

describe("types", () => {
  test("Compact", () => {
    const obj = {a:1, b:"foo", c:undefined};
    type C = Compact<typeof obj>;
    expectTypeOf<C>().toEqualTypeOf<{a:number,b:string}>();
  });

  test("TupleSplit", () => {
    type F = TupleSplit<[1,2,3,4], 2> // [[1,2], [3,4]]
    expectTypeOf<F>().toEqualTypeOf<[[1,2], [3,4]]>();
    expectTypeOf<TupleSplit<[1,2,3,4], 0>>().toEqualTypeOf<[[], [1,2,3,4]]>();
    expectTypeOf<TupleSplit<[1,2,3,4], 10>>().toEqualTypeOf<[[1,2,3,4], []]>();
    // @ts-expect-error
    expectTypeOf<TupleSplit<[1,2,3,4], -1>>().toEqualTypeOf<[[], [1,2,3,4]]>();
  });

  test("RemoveAt", () => {
    type Foo = [1, "test", 2];
    type R = RemoveAt<Foo, 1>;
    expectTypeOf<R>().toEqualTypeOf<[1, 2]>();
  });

  test("ReplaceAt", () => {
    type Foo = [1, "test", 2];
    type R = ReplaceAt<Foo, 1, number>;
    expectTypeOf<R>().toEqualTypeOf<[1, number, 2]>();
  });

  test("InsertAt", () => {
    type Foo = [1, "test", 2];
    type R = InsertAt<Foo, 1, number>;
    expectTypeOf<R>().toEqualTypeOf<[1, number, "test", 2]>();
    type S = InsertAt<R, 10, number>;
    expectTypeOf<S>().toEqualTypeOf<[1, number, "test", 2, number]>();
  });
});

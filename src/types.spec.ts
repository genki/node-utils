import {describe, expectTypeOf, test} from "vitest";
import {
  Compact, Defined, InsertAt, KeysToT, NormalizeOpt, RemoveAt, ReplaceAt, TupleSplit
} from "./types";

describe("types", () => {
  test("Defined", () => {
    expectTypeOf<Defined<number|undefined>>().toEqualTypeOf<number>();
  });

  test("Compact", () => {
    const obj = {a:1, b:"foo", c:undefined};
    type C = Compact<typeof obj>;
    expectTypeOf<C>().toEqualTypeOf<{a:number,b:string}>();
  });

  test("NormalizeOpt", () => {
    type Foo = [a:number, b?:string];
    type N = NormalizeOpt<Foo>;
    expectTypeOf<N>().toEqualTypeOf<[number, string|undefined]>();
  });

  test("TupleSplit", () => {
    type F = TupleSplit<[1,2,3,4], 2> // [[1,2], [3,4]]
    expectTypeOf<F>().toEqualTypeOf<[[1,2], [3,4]]>();
    expectTypeOf<TupleSplit<[1,2,3,4], 0>>().toEqualTypeOf<[[], [1,2,3,4]]>();
    expectTypeOf<TupleSplit<[1,2,3,4], 10>>().toEqualTypeOf<[[1,2,3,4], []]>();
    // @ts-expect-error
    expectTypeOf<TupleSplit<[1,2,3,4], -1>>().toEqualTypeOf<[[], [1,2,3,4]]>();
  });

  test("TupleSplit with optional", () => {
    type X = TupleSplit<[a:1,b?:number,c?:3], 2>
    expectTypeOf<X>().toEqualTypeOf<
      [[1, number|undefined], [c?:3|undefined]]>();
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

    type Bar = [a:number, b?:number]
    type S = ReplaceAt<Bar, 1, string>;
    expectTypeOf<S>().toEqualTypeOf<[a:number, b:string]>();
  });

  test("InsertAt", () => {
    type Foo = [1, "test", 2];
    type R = InsertAt<Foo, 1, number>;
    expectTypeOf<R>().toEqualTypeOf<[1, number, "test", 2]>();
    type S = InsertAt<R, 10, number>;
    expectTypeOf<S>().toEqualTypeOf<[1, number, "test", 2, number]>();
  });

  test("KeysOfT", () => {
    type Foo = {a:number, b?:string};
    expectTypeOf<KeysToT<Foo,number>>().toEqualTypeOf<"a">();
    expectTypeOf<KeysToT<Foo,string|undefined>>().toEqualTypeOf<"b">();
    expectTypeOf<KeysToT<Foo,object>>().toEqualTypeOf<never>();
  });
});

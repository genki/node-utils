import {describe, expect, test, vi} from "vitest";
import {DispoArray} from "./dispo";

describe("DispoArray", () => {
  type Foo = {
    name: string;
    [Symbol.dispose]:() => void;
  }
  test("sync", () => {
    const buf:Foo[] = [];
    const dispo = vi.fn();
    if (1) {
      using foos = DispoArray<Foo>(buf);
      for (let i = 0; i < 10; i++) {
        const foo = {
          name: "foo" + i,
          [Symbol.dispose]:dispo};
        foos.push(foo);
      }
      expect(foos.length).toBe(10);
      expect(buf.length).toBe(10);
      expect(dispo).toHaveBeenCalledTimes(0);
    }
    expect(dispo).toHaveBeenCalledTimes(10);
    expect(buf.length).toBe(0);
  });

  type Bar = {
    name: string;
    [Symbol.asyncDispose]:() => void;
  }
  test("async", async () => {
    const buf:Bar[] = [];
    const dispo = vi.fn();
    if (1) {
      await using bars = DispoArray<Bar>(buf);
      for (let i = 0; i < 10; i++) {
        const bar = {
          name: "bar" + i,
          [Symbol.asyncDispose]:dispo};
        bars.push(bar);
      }
      expect(bars.length).toBe(10);
      expect(buf.length).toBe(10);
      expect(dispo).toHaveBeenCalledTimes(0);
    }
    expect(dispo).toHaveBeenCalledTimes(10);
    expect(buf.length).toBe(0);
  });
});

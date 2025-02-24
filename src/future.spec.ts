import {describe, expect, test} from "vitest";
import {Future} from "./future";

describe("Future", () => {
  test("error in taker", {timeout:200}, async () => {
    const f = new Future(() => {
      throw new Error("error");
    });
    let handled = false;
    try {
      await f;
    } catch (e) {
      handled = true;
    }
    expect(handled).toBeTruthy();
    // check promise rejected
    expect(f.done).toBeTruthy();
  });

  test("ok returns value", async () => {
    const f = new Future<number>();
    const n = await Promise.resolve(42).then(f.ok);
    expect(n).toBe(42);
  });
});

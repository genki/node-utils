import {describe, expect, test} from "vitest";
import {X} from "./misc";

describe("misc", () => {
  test("X", async () => {
    expect(X(undefined)).toBe(false);
    expect(X(0)).toBe(true);
    // @ts-expect-error
    X(Promise.resolve(0));
  });
});

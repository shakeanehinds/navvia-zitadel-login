import { describe, expect, test } from "vitest";
import { summarizeProviderError } from "./api-error";

describe("summarizeProviderError", () => {
  test("extracts only the provider code and message from an API error", () => {
    expect(
      summarizeProviderError(
        JSON.stringify({
          code: 5,
          message: "Instance not found",
          details: [{ accessToken: "must-not-be-logged" }],
        }),
      ),
    ).toEqual({ code: 5, message: "Instance not found" });
  });

  test("bounds provider messages and handles non-JSON responses", () => {
    expect(summarizeProviderError("<html>" + "x".repeat(1000))).toEqual({});
    expect(summarizeProviderError(JSON.stringify({ message: "x".repeat(1000) })).message).toHaveLength(300);
  });
});

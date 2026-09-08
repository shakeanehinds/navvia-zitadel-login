import { createServiceForHost } from "@/lib/service";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/service", () => ({
  createServiceForHost: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  createLogger: () => ({ error: vi.fn() }),
}));

describe("GET /ready", () => {
  let savedApiUrl: string | undefined;
  let savedServiceToken: string | undefined;

  beforeEach(() => {
    savedApiUrl = process.env.ZITADEL_API_URL;
    savedServiceToken = process.env.ZITADEL_SERVICE_USER_TOKEN;
    process.env.ZITADEL_API_URL = "http://localhost:8080";
  });

  afterEach(() => {
    if (savedApiUrl === undefined) {
      delete process.env.ZITADEL_API_URL;
    } else {
      process.env.ZITADEL_API_URL = savedApiUrl;
    }
    if (savedServiceToken === undefined) {
      delete process.env.ZITADEL_SERVICE_USER_TOKEN;
    } else {
      process.env.ZITADEL_SERVICE_USER_TOKEN = savedServiceToken;
    }
    vi.restoreAllMocks();
  });

  test("does not expose the service token", async () => {
    process.env.ZITADEL_API_URL = "https://navvia-nruev0.us1.zitadel.cloud";
    process.env.ZITADEL_SERVICE_USER_TOKEN = "test-login-client-token";
    vi.mocked(createServiceForHost).mockResolvedValue({
      getGeneralSettings: vi.fn().mockResolvedValue({ allowedLanguages: ["en"] }),
    } as any);

    const response = await GET();

    expect(await response.text()).not.toContain("test-login-client-token");
    expect(response.headers.get("x-zitadel-service-user-token")).toBeNull();
  });

  test("should return 200 when gRPC call succeeds", async () => {
    vi.mocked(createServiceForHost).mockResolvedValue({
      getGeneralSettings: vi.fn().mockResolvedValue({ allowedLanguages: ["en"] }),
    } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(await response.text()).toBe("OK");
  });

  test("should return 503 when gRPC call fails", async () => {
    vi.mocked(createServiceForHost).mockResolvedValue({
      getGeneralSettings: vi.fn().mockRejectedValue(new Error("connection refused")),
    } as any);

    const response = await GET();

    expect(response.status).toBe(503);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(await response.text()).toBe("Service unavailable");
  });

  test("should return 503 when authentication fails", async () => {
    vi.mocked(createServiceForHost).mockRejectedValue(new Error("No authentication credentials found"));

    const response = await GET();

    expect(response.status).toBe(503);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(await response.text()).toBe("Service unavailable");
  });

  test("should return 503 when ZITADEL_API_URL is not set", async () => {
    delete process.env.ZITADEL_API_URL;

    const response = await GET();

    expect(response.status).toBe(503);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(await response.text()).toBe("Service unavailable");
  });
});

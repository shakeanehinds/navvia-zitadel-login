import { beforeEach, describe, expect, test, vi } from "vitest";

const { createServiceForHost } = vi.hoisted(() => ({
  createServiceForHost: vi.fn(),
}));

vi.mock("./service", () => ({ createServiceForHost }));

import { getHostedLoginTranslation } from "./zitadel";

describe("ZITADEL hosted login translations", () => {
  beforeEach(() => {
    createServiceForHost.mockReset();
  });

  test("returns no custom translations when ZITADEL has none configured", async () => {
    createServiceForHost.mockResolvedValue({
      getHostedLoginTranslation: vi.fn().mockResolvedValue({}),
    });

    await expect(
      getHostedLoginTranslation({
        serviceConfig: { baseUrl: "https://zitadel.example", instanceHost: "missing-translation-test" },
        locale: "en",
      }),
    ).resolves.toBeUndefined();
  });
});

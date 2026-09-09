import { describe, expect, it } from "vitest";

import { getExternalProtocolRewrites } from "../protocol-rewrites.mjs";
import { isZitadelProxyPath } from "./proxy";

describe("isZitadelProxyPath", () => {
  it.each([
    "/.well-known/openid-configuration",
    "/oauth/v2/authorize",
    "/oidc/v1/userinfo",
    "/idps/callback/example",
    "/saml/v2/metadata",
    "/assets/v2/logo.png",
  ])("proxies protocol path %s", (pathname) => {
    expect(isZitadelProxyPath(pathname)).toBe(true);
  });

  it("leaves the Login V2 application base path with Next", () => {
    expect(isZitadelProxyPath("/ui/v2/login/loginname")).toBe(false);
  });
});

describe("external protocol routing", () => {
  it("routes public protocol paths directly to the configured ZITADEL instance", () => {
    expect(getExternalProtocolRewrites("https://instance.zitadel.cloud")).toEqual([
      { source: "/.well-known/:path*", destination: "https://instance.zitadel.cloud/.well-known/:path*", basePath: false },
      { source: "/oauth/:path*", destination: "https://instance.zitadel.cloud/oauth/:path*", basePath: false },
      { source: "/oidc/:path*", destination: "https://instance.zitadel.cloud/oidc/:path*", basePath: false },
      { source: "/idps/callback/:path*", destination: "https://instance.zitadel.cloud/idps/callback/:path*", basePath: false },
      { source: "/saml/:path*", destination: "https://instance.zitadel.cloud/saml/:path*", basePath: false },
      { source: "/assets/:path*", destination: "https://instance.zitadel.cloud/assets/:path*", basePath: false },
    ]);
  });
});

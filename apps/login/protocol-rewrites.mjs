const protocolPrefixes = ["/.well-known", "/oauth", "/oidc", "/idps/callback", "/saml", "/assets"];

export function getExternalProtocolRewrites(baseUrl) {
  const origin = baseUrl.replace(/\/$/, "");

  return protocolPrefixes.map((prefix) => ({
    source: `${prefix}/:path*`,
    destination: `${origin}${prefix}/:path*`,
    basePath: false,
  }));
}

# Navvia Login V2 staging runbook

## Scope

This runbook covers the isolated Navvia Login V2 Preview deployment. It does not authorize production cutover or changes to the existing `navvia.app` authentication flow.

## Staging topology

- Vercel project: `offing-spinels0i-5054s-projects/navvia-zitadel-login`
- Stable Preview URL: `https://navvia-zitadel-login-preview.vercel.app`
- Login base path: `/ui/v2/login`
- ZITADEL instance: `https://navvia-nruev0.us1.zitadel.cloud`
- Preview login route: `https://navvia-zitadel-login-preview.vercel.app/ui/v2/login/loginname`
- Readiness route: `https://navvia-zitadel-login-preview.vercel.app/ui/v2/login/ready`

The Next.js application serves Login V2 beneath its base path. Root OIDC, SAML, callback, discovery, and asset paths are externally rewritten to the configured ZITADEL instance. The stable Preview hostname is registered as a ZITADEL Trusted Domain.

## Vercel environment

Configure these values for Preview without storing values in this repository:

- `NEXT_PUBLIC_BASE_PATH`
- `ZITADEL_API_URL`
- `ZITADEL_INSTANCE_HOST`
- `EMAIL_VERIFICATION`
- `CUSTOM_REQUEST_HEADERS`
- `ZITADEL_SERVICE_USER_TOKEN` (secret)

Set `ZITADEL_INSTANCE_HOST` to the hostname portion of `ZITADEL_API_URL`, without a scheme or path (for example, `navvia-nruev0.us1.zitadel.cloud`). It identifies the ZITADEL instance and must not be the separate login UI hostname.

`ZITADEL_SERVICE_USER_TOKEN` must be the least-privileged Login Client PAT with `IAM_LOGIN_CLIENT`. Never deploy the IAM Owner recovery PAT.

Track PAT ownership, expiry, and rotation in Infisical. Rotation timing is not duplicated in this repository.

## Deployment

1. Deploy to Preview only.
2. Wait for Vercel to report `READY`.
3. Point `navvia-zitadel-login-preview.vercel.app` at the ready deployment.
4. Do not trust generated deployment hostnames; they change after each deployment.

## Verification

1. Confirm `/ui/v2/login/ready` returns `200 OK` and `OK`. This checks API reachability and general settings only; it does not prove that the login route can render.
2. Confirm `/ui/v2/login/loginname` returns `200 OK`, renders the Navvia authentication shell, and shows at least one usable sign-in method without a Server Components error. An HTTP 200 by itself is insufficient because the application error boundary can render an error page with that status.
3. Request `/oauth/v2/authorize` without parameters. A ZITADEL `400 invalid_request` response stating that `client_id` is missing proves the root bridge is working.
4. Run a real authorization request from the non-production Navvia application.
5. Test username/password, MFA, cancellation, logout, account switching, error recovery, and mobile-browser behavior.
6. Test external IdP callbacks, passkeys, and SAML only if those capabilities are enabled.

## Rollback

If Preview login fails:

1. Disable **Use new login UI** on the non-production ZITADEL application, or clear its custom Login V2 base URL.
2. If an instance-wide Login V2 feature was enabled, disable it using the break-glass IAM Owner PAT.
3. Repoint the stable Preview alias to the last known-good Vercel deployment if the failure is deployment-specific.
4. Keep production authentication unchanged until the complete staging matrix passes.

## Production gate

Before enabling the production Login V2 flow, configure `ZITADEL_INSTANCE_HOST` in the Production environment to the hostname portion of `ZITADEL_API_URL`. The production login UI host is not the ZITADEL instance host. Do not enable Login V2 instance-wide or alter production redirects until Preview acceptance is complete and an explicit production change is approved.

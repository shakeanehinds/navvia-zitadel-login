import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import { ReactNode } from "react";
import { ThemeWrapper } from "./theme-wrapper";

/**
 * Keeps ZITADEL branding variables available while Navvia owns the visual shell.
 * Route children remain untouched so all upstream form and flow behavior is preserved.
 */
export function DynamicTheme({
  branding,
  children,
}: {
  children: ReactNode | ((isSideBySide: boolean) => ReactNode);
  branding?: BrandingSettings;
}) {
  const content = typeof children === "function" ? children(false) : children;

  return (
    <ThemeWrapper branding={branding}>
      <div className="navvia-auth-flow">{content}</div>
    </ThemeWrapper>
  );
}

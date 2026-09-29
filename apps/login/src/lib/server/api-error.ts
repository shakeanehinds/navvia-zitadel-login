export interface ProviderErrorSummary {
  code?: number | string;
  message?: string;
}

/** Extract only bounded, non-sensitive error fields from a provider response. */
export function summarizeProviderError(body: string): ProviderErrorSummary {
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object") return {};

    const record = parsed as Record<string, unknown>;
    const code = typeof record.code === "number" || typeof record.code === "string" ? record.code : undefined;
    const message = typeof record.message === "string" ? record.message.slice(0, 300) : undefined;

    return {
      ...(code !== undefined && { code }),
      ...(message && { message }),
    };
  } catch {
    return {};
  }
}

import type { ZodError } from "zod";

/** First Zod message per top-level field (`path[0]`). */
export function firstZodMessagePerField(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}

type ClerkErrorLike = {
  errors?: Array<{
    longMessage?: string;
    message?: string;
    meta?: { param_name?: string };
    code?: string;
  }>;
};

export function clerkErrorTargetsUsername(err: unknown): boolean {
  const errors = (err as ClerkErrorLike)?.errors;
  if (!errors?.length) return false;
  return errors.some(
    (e) =>
      e.meta?.param_name === "username" ||
      String(e.code ?? "")
        .toLowerCase()
        .includes("username"),
  );
}

export function getClerkErrorMessage(
  err: unknown,
  fallback: string,
): string {
  const firstError = (err as ClerkErrorLike)?.errors?.[0];
  return firstError?.longMessage ?? firstError?.message ?? fallback;
}

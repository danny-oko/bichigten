"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnAuth, mnLabels } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";

type SignInFormProps = {
  isLoaded: boolean;
  isSigningIn: boolean;
  error: string | null;
  onGoogleSignIn: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.63v3.01h3.88c2.27-2.1 3.56-5.2 3.56-8.67z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.01c-1.08.72-2.46 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09A11.98 11.98 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.32A7.2 7.2 0 0 1 4.94 12c0-.8.14-1.57.37-2.32V6.59H1.3A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.3 5.41l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.59 1.8l3.44-3.45C17.94 1.16 15.23 0 12 0A11.98 11.98 0 0 0 1.3 6.59l4.01 3.09c.94-2.82 3.58-4.91 6.69-4.91z"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className="opacity-25"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
      />
    </svg>
  );
}

const inputClassName =
  "h-11 rounded-xl border-border/80 bg-background text-sm shadow-none transition-colors focus-visible:border-primary focus-visible:ring-primary/20 sm:h-12";

export function SignInForm({
  isLoaded,
  isSigningIn,
  error,
  onGoogleSignIn,
  onSubmit,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const busy = !isLoaded || isSigningIn;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(new FormData(event.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Button
        type="button"
        variant="outline"
        onClick={onGoogleSignIn}
        disabled={busy}
        className="h-11 w-full gap-2.5 rounded-xl border-border bg-background text-sm font-medium text-foreground shadow-none hover:bg-muted/60 hover:text-foreground sm:h-12"
      >
        <GoogleLogo />
        {mnUi.googleSignIn}
      </Button>

      <FieldSeparator className="my-1 [&_[data-slot=field-separator-content]]:bg-card">
        {mnUi.orContinueWithEmail}
      </FieldSeparator>

      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            {mnLabels.email}
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={busy}
            placeholder={mnAuth.emailPlaceholder}
            className={inputClassName}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            {mnLabels.password}
          </FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={busy}
              placeholder={mnAuth.passwordPlaceholder}
              className={`${inputClassName} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={busy}
              aria-label={showPassword ? mnUi.hidePassword : mnUi.showPassword}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <FieldError>{error}</FieldError>
        <div id="clerk-captcha" />

        <Button
          type="submit"
          disabled={busy}
          className="h-11 w-full rounded-xl text-sm font-semibold shadow-none sm:h-12"
        >
          {isSigningIn ? (
            <>
              <LoadingSpinner />
              {mnUi.signingIn}
            </>
          ) : (
            mnUi.signIn
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

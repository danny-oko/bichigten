"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getClerkErrorMessage } from "@/lib/clerk/error-message";
import { mnAuth, mnLabels, mnValidation } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";
import { signInSchema } from "@/lib/validators/auth";

const HOME_ROUTE = "/home";

export default function SignInPage() {
  const { isSignedIn, isLoaded: sessionLoaded } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [secondFactorEmailAddressId, setSecondFactorEmailAddressId] = useState<
    string | null
  >(null);
  const [isSecondFactorBusy, setIsSecondFactorBusy] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    router.prefetch(HOME_ROUTE);
  }, [isLoaded, router]);

  useEffect(() => {
    if (!sessionLoaded || !isSignedIn) return;
    router.replace(HOME_ROUTE);
  }, [sessionLoaded, isSignedIn, router]);
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      if (!sessionLoaded || !isSignedIn) return;
      router.replace(HOME_ROUTE);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [sessionLoaded, isSignedIn, router]);

  const onGoogleSignIn = async () => {
    if (!isLoaded || !signIn || typeof window === "undefined") return;
    setError(null);
    const origin = window.location.origin;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${origin}/sso-callback`,
        redirectUrlComplete: `${origin}${HOME_ROUTE}`,
      });
    } catch (err: unknown) {
      setError(getClerkErrorMessage(err, mnAuth.googleSignInFailed));
    }
  };

  const onSubmit = async (formData: FormData) => {
    if (!isLoaded) return;
    setError(null);
    setIsSigningIn(true);

    const parsed = signInSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    if (!parsed.success) {
      setIsSigningIn(false);
      return setError(
        parsed.error.issues[0]?.message ?? mnValidation.invalidInput,
      );
    }

    const identifier = parsed.data.email;
    const password = parsed.data.password;

    let keepSigningInSpinner = false;
    try {
      const attempt = await signIn.create({
        identifier,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace(HOME_ROUTE);
        keepSigningInSpinner = true;
        return;
      }

      if (attempt.status === "needs_second_factor") {
        const factor = attempt.supportedSecondFactors?.find(
          (f) => f.strategy === "email_code",
        );

        if (factor?.strategy === "email_code") {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: factor.emailAddressId,
          });
          setSecondFactorEmailAddressId(factor.emailAddressId);
          setError(null);
          return;
        }

        setError(mnAuth.secondFactorUnsupported);
        return;
      }

      setError(mnAuth.signInNeedsStep(attempt.status));
    } catch (err: unknown) {
      const msg = (err as { errors?: Array<{ message?: string }> })?.errors?.[0]
        ?.message;
      if (msg?.toLowerCase().includes("session already exists")) {
        await signOut();
        setError(mnAuth.sessionCleared);
        return;
      }
      setError(msg ?? mnAuth.signInFailed);
    } finally {
      if (!keepSigningInSpinner) setIsSigningIn(false);
    }
  };

  const onSecondFactorSubmit = async (formData: FormData) => {
    if (!isLoaded || !signIn || !secondFactorEmailAddressId) return;
    const code = String(formData.get("code") ?? "").trim();
    if (!code) {
      setError(mnAuth.enterVerificationCode);
      return;
    }

    setError(null);
    setIsSecondFactorBusy(true);
    let keepSecondFactorSpinner = false;
    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace(HOME_ROUTE);
        keepSecondFactorSpinner = true;
        return;
      }

      setError(mnAuth.verificationIncomplete);
    } catch (err: unknown) {
      setError(getClerkErrorMessage(err, mnAuth.invalidOrExpiredCode));
    } finally {
      if (!keepSecondFactorSpinner) setIsSecondFactorBusy(false);
    }
  };

  const onResendSecondFactor = async () => {
    if (!isLoaded || !signIn || !secondFactorEmailAddressId) return;
    setError(null);
    setIsSecondFactorBusy(true);
    try {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: secondFactorEmailAddressId,
      });
    } catch (err: unknown) {
      setError(getClerkErrorMessage(err, mnAuth.resendCodeFailed));
    } finally {
      setIsSecondFactorBusy(false);
    }
  };

  return (
    <AuthShell>
      <AuthHeader />
      {secondFactorEmailAddressId ? (
        <form action={onSecondFactorSubmit} className="space-y-4">
          <p className="text-center text-sm text-amber-900/90">
            {mnAuth.signIn2faBeforeClientTrust}
            <span className="whitespace-nowrap">{mnAuth.signIn2faClientTrust}</span>
            {mnAuth.signIn2faAfterClientTrustBeforeCode}
            <code className="rounded bg-amber-100 px-1">424242</code>
            {mnAuth.signIn2faAfterCode}
          </p>
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel
                htmlFor="sign-in-2fa-code"
                className="text-sm font-semibold tracking-wide text-[#E8920A]"
              >
                {mnLabels.verificationCode}
              </FieldLabel>
              <Input
                id="sign-in-2fa-code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                disabled={isSecondFactorBusy}
                className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm sm:h-12 sm:text-base disabled:opacity-60"
                placeholder={mnAuth.verificationCodePlaceholder}
              />
            </Field>
            <FieldError>{error}</FieldError>
            <Button
              type="submit"
              disabled={isSecondFactorBusy}
              className="h-11 w-full rounded-2xl bg-[#E8920A] text-sm text-white hover:bg-[#cf7d09] sm:h-12 sm:text-base"
            >
              {isSecondFactorBusy ? mnUi.verifying : mnUi.continue}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onResendSecondFactor}
              disabled={isSecondFactorBusy}
              className="w-full rounded-xl border-amber-300 text-sm"
            >
              {mnUi.resendCode}
            </Button>
          </FieldGroup>
        </form>
      ) : (
        <SignInForm
          isLoaded={isLoaded}
          isSigningIn={isSigningIn}
          error={error}
          onGoogleSignIn={onGoogleSignIn}
          onSubmit={onSubmit}
        />
      )}

      <p className="text-center text-xs text-amber-900/80 sm:text-sm">
        {mnUi.noAccountYet}{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-amber-800 hover:text-amber-900 hover:underline"
        >
          {mnUi.signUp}
        </Link>
      </p>
    </AuthShell>
  );
}

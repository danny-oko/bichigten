"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSignUp } from "@clerk/nextjs/legacy";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthShell } from "@/components/auth/AuthShell";
import { EmailVerificationBlock } from "@/components/sign-up/EmailVerificationBlock";
import { SignUpStep2Form } from "@/components/sign-up/SignUpStep2Form";
import { SignUpSubmitActions } from "@/components/sign-up/SignUpSubmitActions";
import { FieldError } from "@/components/ui/field";
import { clerkErrorTargetsUsername, getClerkErrorMessage } from "@/lib/clerk/error-message";
import {
  clearSignUpDraft,
  readSignUpDraft,
  type SignUpDraft,
} from "@/lib/sign-up-draft";
import { mnSignUp } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";
import { firstZodMessagePerField } from "@/lib/validators/map-zod-field-errors";
import { signUpCredentialsSchema, signUpStep1Schema } from "@/lib/validators/auth";

const HOME_ROUTE = "/home";

type Step2FieldKey = "email" | "password" | "confirmPassword";

export default function SignUpCredentialsPage() {
  const { isSignedIn, isLoaded: sessionLoaded } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [draft, setDraft] = useState<SignUpDraft | null>(null);
  const [draftChecked, setDraftChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingEmailVerification, setAwaitingEmailVerification] =
    useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<Step2FieldKey, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyInfo, setVerifyInfo] = useState<string | null>(null);

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

  useEffect(() => {
    const d = readSignUpDraft();
    if (!d) {
      router.replace("/sign-up");
      return;
    }
    const step1 = signUpStep1Schema.safeParse({
      fullName: d.fullName,
      username: d.username,
      age: String(d.age),
    });
    if (!step1.success) {
      router.replace("/sign-up");
      return;
    }
    setDraft(d);
    setDraftChecked(true);
  }, [router]);

  const submit = async () => {
    setFieldErrors({});
    setFormError(null);
    setVerifyInfo(null);
    if (!isLoaded || !signUp || !draft) return;

    if (awaitingEmailVerification) {
      if (!verificationCode.trim()) {
        setFormError(mnSignUp.verifyCodeMissing);
        return;
      }
      try {
        setIsSubmitting(true);
        const result = await signUp.attemptEmailAddressVerification({
          code: verificationCode.trim(),
        });
        if (result.createdSessionId) {
          clearSignUpDraft();
          await setActive?.({ session: result.createdSessionId });
          router.replace(HOME_ROUTE);
          return;
        }
        setFormError(mnSignUp.signUpIncomplete);
      } catch (err: unknown) {
        setFormError(
          getClerkErrorMessage(err, mnSignUp.createAccountFailed),
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const parsed = signUpCredentialsSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      const mapped = firstZodMessagePerField(parsed.error);
      setFieldErrors({
        email: mapped.email,
        password: mapped.password,
        confirmPassword: mapped.confirmPassword,
      });
      return;
    }

    const [firstName, ...rest] = draft.fullName.trim().split(/\s+/);
    const lastName = rest.join(" ") || firstName || "-";

    try {
      setIsSubmitting(true);
      const result = await signUp.create({
        emailAddress: parsed.data.email.trim(),
        username: draft.username.trim(),
        password: parsed.data.password,
        firstName: firstName ?? "",
        lastName,
        unsafeMetadata: { age: draft.age },
      });

      if (result.createdSessionId) {
        clearSignUpDraft();
        await setActive?.({ session: result.createdSessionId });
        router.replace(HOME_ROUTE);
        return;
      }

      const unverified = (result as { unverifiedFields?: string[] })
        .unverifiedFields;
      if (
        result.status === "missing_requirements" &&
        unverified?.includes("email_address")
      ) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setFieldErrors({});
        setAwaitingEmailVerification(true);
        setVerifyInfo(mnSignUp.emailVerifySent);
        return;
      }

      setFormError(mnSignUp.signUpIncomplete);
    } catch (err: unknown) {
      setFieldErrors({});
      if (clerkErrorTargetsUsername(err)) {
        router.replace("/sign-up");
        return;
      }
      setFormError(
        getClerkErrorMessage(err, mnSignUp.createAccountFailed),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!isLoaded || !signUp) return;
    setFormError(null);
    setVerifyInfo(null);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifyInfo(mnSignUp.verifyResentInfo);
    } catch (err: unknown) {
      setFormError(
        getClerkErrorMessage(err, mnSignUp.resendVerifyFailed),
      );
    }
  };

  if (!draftChecked || !draft) {
    return (
      <AuthShell viewportLocked>
        <AuthHeader />
        <p className="text-center text-xs text-amber-800 sm:text-sm">
          {mnUi.preparing}
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell viewportLocked>
      <div className="shrink-0">
        <AuthHeader />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SignUpStep2Form
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              onChangeEmail={(v) => {
                setEmail(v);
                setFieldErrors((prev) => {
                  if (!prev.email) return prev;
                  const next = { ...prev };
                  delete next.email;
                  return next;
                });
              }}
              onChangePassword={(v) => {
                setPassword(v);
                setFieldErrors((prev) => {
                  if (!prev.password && !prev.confirmPassword) return prev;
                  const next = { ...prev };
                  delete next.password;
                  delete next.confirmPassword;
                  return next;
                });
              }}
              onChangeConfirmPassword={(v) => {
                setConfirmPassword(v);
                setFieldErrors((prev) => {
                  if (!prev.confirmPassword) return prev;
                  const next = { ...prev };
                  delete next.confirmPassword;
                  return next;
                });
              }}
              fieldErrors={fieldErrors}
            />

            {!awaitingEmailVerification && formError ? (
              <div className="mt-3 w-full sm:mt-4" aria-live="polite">
                <FieldError className="leading-snug">{formError}</FieldError>
              </div>
            ) : null}

            {awaitingEmailVerification ? (
              <div className="mt-5">
                <EmailVerificationBlock
                  verificationCode={verificationCode}
                  verifyInfo={verifyInfo}
                  onChangeCode={(v) => {
                    setVerificationCode(v);
                    setFormError(null);
                  }}
                  onResendCode={resendVerificationCode}
                  error={formError}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-4">
          <div id="clerk-captcha" className="min-h-0 shrink-0" />

          <SignUpSubmitActions
            isLoaded={isLoaded}
            isSubmitting={isSubmitting}
            awaitingEmailVerification={awaitingEmailVerification}
            onSubmit={submit}
            onBack={() => router.push("/sign-up")}
          />
        </div>
      </div>

      <p className="mt-1 shrink-0 text-center text-xs text-amber-900/80 sm:text-sm">
        {mnUi.haveAccount}{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-amber-800 underline-offset-2 transition-colors hover:text-amber-950 hover:underline"
        >
          {mnUi.logIn}
        </Link>
      </p>
    </AuthShell>
  );
}

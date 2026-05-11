"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSignUp } from "@clerk/nextjs/legacy";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthShell } from "@/components/auth/AuthShell";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { getClerkErrorMessage } from "@/lib/clerk/error-message";
import { AgeSignUp } from "@/components/sign-up/AgeSignUp";
import { EmailVerificationBlock } from "@/components/sign-up/EmailVerificationBlock";
import { NameSignUp } from "@/components/sign-up/NameSignUp";
import { PasswordSignUp } from "@/components/sign-up/PasswordSignUp";
import { SignUpProgress } from "@/components/sign-up/SignUpProgress";
import { SignUpStepActions } from "@/components/sign-up/SignUpStepActions";
import { mnSignUp, mnValidation } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";
import {
  ageSchema,
  signUpNameSchema,
  signUpPasswordSchema,
} from "@/lib/validators/auth";

const HOME_ROUTE = "/home";

export default function SignUpPage() {
  const { isSignedIn, isLoaded: sessionLoaded } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

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
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingEmailVerification, setAwaitingEmailVerification] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyInfo, setVerifyInfo] = useState<string | null>(null);

  const goNextFromName = () => {
    setError(null);
    const parsed = signUpNameSchema.safeParse({ fullName, username, email });
    if (!parsed.success) {
      return setError(
        parsed.error.issues[0]?.message ?? mnValidation.invalidInput,
      );
    }
    setStep(2);
  };

  const goNextFromPassword = () => {
    setError(null);
    const parsed = signUpPasswordSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      return setError(
        parsed.error.issues[0]?.message ?? mnValidation.invalidPassword,
      );
    }
    setStep(3);
  };

  const finish = async () => {
    setError(null);
    setVerifyInfo(null);
    if (!isLoaded || !signUp) return;
    const ageParsed = ageSchema.safeParse(age);
    if (!ageParsed.success) {
      return setError(
        ageParsed.error.issues[0]?.message ?? mnValidation.ageInvalid,
      );
    }
    const ageValue = ageParsed.data;

    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ") || firstName || "-";

    try {
      setIsSubmitting(true);
      let result;
      if (awaitingEmailVerification) {
        if (!verificationCode.trim()) {
          setError(mnSignUp.verifyCodeMissing);
          return;
        }
        result = await signUp.attemptEmailAddressVerification({
          code: verificationCode.trim(),
        });
      } else {
        result = await signUp.create({
          emailAddress: email.trim(),
          username: username.trim(),
          password,
          firstName: firstName ?? "",
          lastName,
          unsafeMetadata: { age: ageValue },
        });
      }

      if (result.createdSessionId) {
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
        setAwaitingEmailVerification(true);
        setVerifyInfo(mnSignUp.emailVerifySent);
        return;
      }

      setError(mnSignUp.signUpIncomplete);
    } catch (err: unknown) {
      setError(
        getClerkErrorMessage(err, mnSignUp.createAccountFailed),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!isLoaded || !signUp) return;
    setError(null);
    setVerifyInfo(null);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifyInfo(mnSignUp.verifyResentInfo);
    } catch (err: unknown) {
      setError(
        getClerkErrorMessage(err, mnSignUp.resendVerifyFailed),
      );
    }
  };

  return (
    <AuthShell>
      <AuthHeader />
      <SignUpProgress step={step} />
      <div
        className="h-px w-full bg-linear-to-r from-transparent via-amber-200 to-transparent"
        aria-hidden
      />

      <FieldGroup className="gap-5 sm:gap-6">
        <div
          key={step}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {step === 1 && (
            <NameSignUp
              fullName={fullName}
              username={username}
              email={email}
              onChangeFullName={setFullName}
              onChangeUsername={setUsername}
              onChangeEmail={setEmail}
            />
          )}

          {step === 2 && (
            <PasswordSignUp
              password={password}
              confirmPassword={confirmPassword}
              onChangePassword={setPassword}
              onChangeConfirmPassword={setConfirmPassword}
            />
          )}

          {step === 3 && <AgeSignUp value={age} onChange={setAge} />}

          {step === 3 && awaitingEmailVerification && (
            <div className="mt-4 border-t border-amber-100 pt-4">
              <EmailVerificationBlock
                verificationCode={verificationCode}
                verifyInfo={verifyInfo}
                onChangeCode={setVerificationCode}
                onResendCode={resendVerificationCode}
              />
            </div>
          )}
        </div>

        <FieldError>{error}</FieldError>
        <div id="clerk-captcha" />

        <SignUpStepActions
          step={step}
          isLoaded={isLoaded}
          isSubmitting={isSubmitting}
          awaitingEmailVerification={awaitingEmailVerification}
          onBack={() => {
            setError(null);
            setStep((s) => Math.max(1, s - 1));
          }}
          onContinueFromName={goNextFromName}
          onNextFromPassword={goNextFromPassword}
          onFinish={finish}
        />
      </FieldGroup>

      <p className="text-center text-xs text-amber-900/80 sm:text-sm">
        {mnUi.haveAccount}{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-amber-800 hover:text-amber-900 hover:underline"
        >
          {mnUi.logIn}
        </Link>
      </p>
    </AuthShell>
  );
}

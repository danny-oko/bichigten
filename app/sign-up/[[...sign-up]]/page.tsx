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
      return setError(parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    setStep(2);
  };

  const goNextFromPassword = () => {
    setError(null);
    const parsed = signUpPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      return setError(parsed.error.issues[0]?.message ?? "Invalid password.");
    }
    setStep(3);
  };

  const finish = async () => {
    setError(null);
    setVerifyInfo(null);
    if (!isLoaded || !signUp) return;
    const ageParsed = ageSchema.safeParse(age);
    if (!ageParsed.success) {
      return setError(ageParsed.error.issues[0]?.message ?? "Invalid age.");
    }
    const ageValue = ageParsed.data;

    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ") || firstName || "-";

    try {
      setIsSubmitting(true);
      let result;
      if (awaitingEmailVerification) {
        if (!verificationCode.trim()) {
          setError("Enter the verification code from your email.");
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
        setVerifyInfo(
          "We sent a verification code to your email. Enter it to continue.",
        );
        return;
      }

      setError(
        "Sign-up started but is not complete yet. Please complete required verification.",
      );
    } catch (err: unknown) {
      setError(getClerkErrorMessage(err, "Unable to create account. Please try again."));
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
      setVerifyInfo(
        "A new verification code was sent. Check inbox and spam/promotions.",
      );
    } catch (err: unknown) {
      setError(getClerkErrorMessage(err, "Could not resend verification code."));
    }
  };

  return (
    <AuthShell>
      <AuthHeader />
      <SignUpProgress step={step} />

      <FieldGroup>
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
          <EmailVerificationBlock
            verificationCode={verificationCode}
            verifyInfo={verifyInfo}
            onChangeCode={setVerificationCode}
            onResendCode={resendVerificationCode}
          />
        )}

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
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-amber-800 hover:text-amber-900 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

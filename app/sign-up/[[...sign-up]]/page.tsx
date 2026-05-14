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
import { EmailVerificationBlock } from "@/components/sign-up/EmailVerificationBlock";
import { NameSignUp } from "@/components/sign-up/NameSignUp";
import { PasswordSignUp } from "@/components/sign-up/PasswordSignUp";
import { SignUpStepActions } from "@/components/sign-up/SignUpStepActions";
import { mnSignUp, mnValidation } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";
import {
  ageSchema,
  signUpAccountStepSchema,
  signUpProfileStepSchema,
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

  const goContinueFromProfile = () => {
    setError(null);
    const parsed = signUpProfileStepSchema.safeParse({
      fullName,
      username,
      age,
    });
    if (!parsed.success) {
      return setError(
        parsed.error.issues[0]?.message ?? mnValidation.invalidInput,
      );
    }
    setStep(2);
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

    const accountParsed = signUpAccountStepSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!accountParsed.success) {
      return setError(
        accountParsed.error.issues[0]?.message ?? mnValidation.invalidPassword,
      );
    }

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

      <FieldGroup className="gap-3 sm:gap-4">
        <div
          key={step}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {step === 1 && (
            <NameSignUp
              fullName={fullName}
              username={username}
              age={age}
              onChangeFullName={setFullName}
              onChangeUsername={setUsername}
              onChangeAge={setAge}
            />
          )}

          {step === 2 && (
            <>
              <PasswordSignUp
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                onChangeEmail={setEmail}
                onChangePassword={setPassword}
                onChangeConfirmPassword={setConfirmPassword}
              />
              {awaitingEmailVerification && (
                <div className="mt-4 border-t border-amber-100 pt-4">
                  <EmailVerificationBlock
                    verificationCode={verificationCode}
                    verifyInfo={verifyInfo}
                    onChangeCode={setVerificationCode}
                    onResendCode={resendVerificationCode}
                  />
                </div>
              )}
            </>
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
            setStep(1);
          }}
          onContinueFromProfile={goContinueFromProfile}
          onStartLearning={finish}
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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpStep1Form } from "@/components/sign-up/SignUpStep1Form";
import {
  signUpFocusRing,
  signUpPrimaryButtonClass,
} from "@/components/sign-up/sign-up-classes";
import { readSignUpDraft, writeSignUpDraft } from "@/lib/sign-up-draft";
import { cn } from "@/lib/utils";
import { mnUi } from "@/lib/i18n/mn-ui";
import { firstZodMessagePerField } from "@/lib/validators/map-zod-field-errors";
import { signUpStep1Schema } from "@/lib/validators/auth";

const HOME_ROUTE = "/home";

type Step1FieldKey = "fullName" | "username" | "age";

export default function SignUpStep1Page() {
  const { isSignedIn, isLoaded: sessionLoaded } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<Step1FieldKey, string>>
  >({});

  useEffect(() => {
    if (!sessionLoaded || !isSignedIn) return;
    router.replace(HOME_ROUTE);
  }, [sessionLoaded, isSignedIn, router]);

  useEffect(() => {
    const d = readSignUpDraft();
    if (!d) return;
    setFullName(d.fullName);
    setUsername(d.username);
    setAge(String(d.age));
  }, []);

  const continueToCredentials = () => {
    setFieldErrors({});
    const parsed = signUpStep1Schema.safeParse({
      fullName,
      username,
      age,
    });
    if (!parsed.success) {
      const mapped = firstZodMessagePerField(parsed.error);
      setFieldErrors({
        fullName: mapped.fullName,
        username: mapped.username,
        age: mapped.age,
      });
      return;
    }
    writeSignUpDraft({
      fullName: parsed.data.fullName.trim(),
      username: parsed.data.username.trim(),
      age: parsed.data.age,
    });
    router.push("/sign-up/credentials");
  };

  return (
    <AuthShell viewportLocked>
      <div className="shrink-0">
        <AuthHeader />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SignUpStep1Form
              fullName={fullName}
              username={username}
              age={age}
              onChangeFullName={(v) => {
                setFullName(v);
                setFieldErrors((prev) => {
                  if (!prev.fullName) return prev;
                  const next = { ...prev };
                  delete next.fullName;
                  return next;
                });
              }}
              onChangeUsername={(v) => {
                setUsername(v);
                setFieldErrors((prev) => {
                  if (!prev.username) return prev;
                  const next = { ...prev };
                  delete next.username;
                  return next;
                });
              }}
              onChangeAge={(v) => {
                setAge(v);
                setFieldErrors((prev) => {
                  if (!prev.age) return prev;
                  const next = { ...prev };
                  delete next.age;
                  return next;
                });
              }}
              fieldErrors={fieldErrors}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={continueToCredentials}
          className={cn(
            signUpPrimaryButtonClass({ fullWidth: true }),
            signUpFocusRing,
            "shrink-0",
          )}
        >
          {mnUi.continue}
        </button>
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

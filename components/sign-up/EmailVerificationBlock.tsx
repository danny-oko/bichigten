import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnLabels, mnSignUp } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";
import { cn } from "@/lib/utils";

import {
  signUpFocusRing,
  signUpInputClass,
  signUpLabelClass,
  signUpTextButtonClass,
  signUpVerificationPanel,
} from "./sign-up-classes";

type EmailVerificationBlockProps = {
  verificationCode: string;
  verifyInfo: string | null;
  onChangeCode: (value: string) => void;
  onResendCode: () => void;
  /** Clerk / missing-code messages shown under the code field */
  error?: string | null;
};

export function EmailVerificationBlock({
  verificationCode,
  verifyInfo,
  onChangeCode,
  onResendCode,
  error,
}: EmailVerificationBlockProps) {
  return (
    <div className={signUpVerificationPanel}>
      <label htmlFor="verificationCode" className={cn("block", signUpLabelClass)}>
        {mnLabels.verificationCode}
      </label>
      <Input
        id="verificationCode"
        value={verificationCode}
        onChange={(e) => onChangeCode(e.target.value)}
        className={signUpInputClass}
        placeholder={mnSignUp.codePlaceholder}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-invalid={error ? true : undefined}
      />
      {error ? (
        <FieldError className="leading-snug text-destructive">{error}</FieldError>
      ) : null}
      <p className="text-xs leading-relaxed text-amber-900/70 sm:text-sm">
        {mnSignUp.emailVerifyHint}
        <code className="rounded-md bg-amber-100/80 px-1 py-0.5 text-amber-950">
          424242
        </code>
        {mnSignUp.emailVerifyHintSuffix}
      </p>
      <button
        type="button"
        onClick={onResendCode}
        className={cn(signUpTextButtonClass, signUpFocusRing)}
      >
        {mnUi.resendCode}
      </button>
      {verifyInfo ? (
        <p className="rounded-xl bg-emerald-50/90 px-3 py-2.5 text-xs leading-snug text-emerald-900 sm:text-sm">
          {verifyInfo}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { mnUi } from "@/lib/i18n/mn-ui";

import {
  signUpPrimaryButtonClass,
  signUpSecondaryButtonClass,
  signUpFocusRing,
} from "./sign-up-classes";

function LoadingSpinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 animate-spin"
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

type SignUpSubmitActionsProps = {
  isLoaded: boolean;
  isSubmitting: boolean;
  awaitingEmailVerification: boolean;
  onSubmit: () => void;
  /** Shown beside the primary button (hidden during email verification). */
  onBack?: () => void;
};

export function SignUpSubmitActions({
  isLoaded,
  isSubmitting,
  awaitingEmailVerification,
  onSubmit,
  onBack,
}: SignUpSubmitActionsProps) {
  const showBack = Boolean(onBack) && !awaitingEmailVerification;

  return (
    <div className="flex w-full shrink-0 gap-2.5">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className={cn(signUpSecondaryButtonClass, signUpFocusRing)}
        >
          {mnUi.back}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || (!awaitingEmailVerification && !isLoaded)}
        className={cn(
          signUpPrimaryButtonClass({ fullWidth: !showBack }),
          signUpFocusRing,
        )}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            {awaitingEmailVerification ? mnUi.verifying : mnUi.creatingAccount}
          </>
        ) : awaitingEmailVerification ? (
          mnUi.verifyStartLearning
        ) : (
          mnUi.startLearning
        )}
      </button>
    </div>
  );
}

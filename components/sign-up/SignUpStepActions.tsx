import { Button } from "@/components/ui/button";
import { mnUi } from "@/lib/i18n/mn-ui";

function LoadingSpinner() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 animate-spin">
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

type SignUpStepActionsProps = {
  step: number;
  isLoaded: boolean;
  isSubmitting: boolean;
  awaitingEmailVerification: boolean;
  onBack: () => void;
  onContinueFromProfile: () => void;
  onStartLearning: () => void;
};

export function SignUpStepActions({
  step,
  isLoaded,
  isSubmitting,
  awaitingEmailVerification,
  onBack,
  onContinueFromProfile,
  onStartLearning,
}: SignUpStepActionsProps) {
  if (step === 1) {
    return (
      <div className="flex justify-center pt-1">
        <Button
          type="button"
          onClick={onContinueFromProfile}
          className="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-[#E8920A] text-base font-semibold text-white hover:bg-[#cf7d09] sm:h-[3.25rem] sm:text-lg"
        >
          {mnUi.continue}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 pt-1 sm:gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isSubmitting || awaitingEmailVerification}
        className="min-h-12 flex-1 rounded-2xl border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 hover:border-[#E8920A] hover:bg-[#E8920A] hover:text-white sm:min-h-[3.25rem] sm:px-4 sm:text-base"
      >
        {mnUi.back}
      </Button>
      <Button
        type="button"
        onClick={onStartLearning}
        disabled={isSubmitting || !isLoaded}
        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E8920A] px-3 text-sm font-semibold text-white hover:bg-[#cf7d09] sm:min-h-[3.25rem] sm:px-4 sm:text-base disabled:opacity-70"
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
      </Button>
    </div>
  );
}

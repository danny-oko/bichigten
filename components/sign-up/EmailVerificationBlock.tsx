import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mnLabels, mnSignUp } from "@/lib/i18n/mn-copy";
import { mnUi } from "@/lib/i18n/mn-ui";

type EmailVerificationBlockProps = {
  verificationCode: string;
  verifyInfo: string | null;
  onChangeCode: (value: string) => void;
  onResendCode: () => void;
};

export function EmailVerificationBlock({
  verificationCode,
  verifyInfo,
  onChangeCode,
  onResendCode,
}: EmailVerificationBlockProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 sm:p-5">
      <label
        htmlFor="verificationCode"
        className="block text-sm font-semibold tracking-wide text-[#E8920A]"
      >
        {mnLabels.verificationCode}
      </label>
      <Input
        id="verificationCode"
        value={verificationCode}
        onChange={(e) => onChangeCode(e.target.value)}
        className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
        placeholder={mnSignUp.codePlaceholder}
        inputMode="numeric"
        autoComplete="one-time-code"
      />
      <p className="text-xs leading-relaxed text-amber-900/70 sm:text-sm">
        {mnSignUp.emailVerifyHint}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-amber-950">424242</code>
        {mnSignUp.emailVerifyHintSuffix}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onResendCode}
        className="w-full rounded-xl border-amber-300 text-sm sm:w-auto"
      >
        {mnUi.resendCode}
      </Button>
      {verifyInfo && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 sm:text-sm">
          {verifyInfo}
        </p>
      )}
    </div>
  );
}

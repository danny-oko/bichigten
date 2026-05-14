import { cn } from "@/lib/utils";

/** Motion: no lift / scale on press */
const btnMotion =
  "border-0 shadow-none transition-colors duration-200 ease-out hover:!translate-y-0 hover:!shadow-none active:!translate-y-0 active:!scale-100";

export const signUpFocusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8920A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf8]";

/** Shared field stack rhythm */
export const signUpFieldStack = "flex w-full min-h-0 flex-col gap-3.5";

export const signUpLabelClass =
  "text-sm font-semibold tracking-wide text-[#a66d12]";

export const signUpInputClass = cn(
  "h-11 w-full rounded-2xl border-0 bg-[#ebe4d6] text-amber-950 shadow-none ring-1 ring-amber-900/[0.08] transition-shadow duration-200",
  "placeholder:text-amber-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8920A]/40",
  "sm:h-12 sm:text-base",
);

/** Primary CTA — full width (step 1) or flex-1 in a row (step 2) */
export function signUpPrimaryButtonClass(opts?: { fullWidth?: boolean }) {
  return cn(
    btnMotion,
    "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-center text-sm font-semibold leading-tight text-white whitespace-normal [text-wrap:balance]",
    "!bg-[#E8920A] hover:!bg-[#d48008] active:!bg-[#b86e07]",
    "disabled:pointer-events-none disabled:!opacity-45",
    opts?.fullWidth ? "h-10 w-full" : "box-border h-10 min-h-10 min-w-0 shrink flex-1 basis-0",
  );
}

/** Secondary / back — same geometry as primary, no border */
export const signUpSecondaryButtonClass = cn(
  btnMotion,
  "box-border inline-flex h-10 min-h-10 min-w-0 shrink flex-1 basis-0 items-center justify-center gap-1.5 rounded-xl px-3 text-center text-sm font-semibold leading-tight whitespace-normal [text-wrap:balance]",
  "!bg-[#e5dac8] !text-amber-950 hover:!bg-[#d9caae] active:!bg-[#ccba98]",
  "disabled:pointer-events-none disabled:!opacity-45",
);

/** Text-style action (e.g. resend code) */
export const signUpTextButtonClass = cn(
  btnMotion,
  "inline-flex h-9 w-full items-center justify-center rounded-xl px-2 text-sm font-medium text-[#a66d12]",
  "!bg-transparent hover:!bg-amber-100/70 active:!bg-amber-200/50",
);

export const signUpVerificationPanel =
  "mt-1 space-y-3 rounded-2xl bg-amber-50/55 p-4 sm:space-y-3.5 sm:p-5";


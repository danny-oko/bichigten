import { LockKeyhole, UserRound } from "lucide-react";

import { mnSignUp } from "@/lib/i18n/mn-copy";

type SignUpProgressProps = {
  step: number;
};

const steps = [
  { id: 1, icon: UserRound, label: mnSignUp.stepYou },
  { id: 2, icon: LockKeyhole, label: mnSignUp.stepPassword },
] as const;

export function SignUpProgress({ step }: SignUpProgressProps) {
  return (
    <div
      className="flex items-start justify-center gap-1 sm:gap-2"
      aria-label={mnSignUp.progressAria}
    >
      {steps.map((item, index) => {
        const Icon = item.icon;
        const isActive = step === item.id;
        const isDone = step > item.id;

        return (
          <div key={item.id} className="flex items-start gap-1 sm:gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 sm:h-10 sm:w-10",
                  isActive
                    ? "scale-105 border-amber-700 bg-amber-700 text-white shadow-md ring-2 ring-amber-400/40 ring-offset-2 ring-offset-white"
                    : isDone
                      ? "border-amber-600 bg-amber-100 text-amber-800"
                      : "border-amber-200 bg-white text-amber-400",
                ].join(" ")}
              >
                <Icon size={14} className="sm:h-4 sm:w-4" />
              </div>
              <span
                className={[
                  "max-w-[4.5rem] text-center text-[10px] font-semibold uppercase tracking-wide sm:max-w-none sm:text-xs",
                  isActive ? "text-amber-900" : "text-amber-700/55",
                ].join(" ")}
              >
                {item.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={[
                  "mt-4 h-0.5 w-6 shrink-0 transition-colors duration-300 sm:mt-5 sm:w-10",
                  step > item.id ? "bg-amber-600" : "bg-amber-200",
                ].join(" ")}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

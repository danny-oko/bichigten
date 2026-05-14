import Image from "next/image";

import { mnAuth } from "@/lib/i18n/mn-copy";

type AuthHeaderProps = {
  /** Tighter branding for viewport-locked auth screens (e.g. sign-up). */
  compact?: boolean;
};

export function AuthHeader({ compact }: AuthHeaderProps) {
  return (
    <>
      <div className="flex shrink-0 justify-center">
        <Image
          src="/icon.svg"
          alt={mnAuth.bearAlt}
          width={84}
          height={84}
          priority
          className={
            compact
              ? "h-9 w-9 sm:h-10 sm:w-10"
              : "h-16 w-16 sm:h-[84px] sm:w-[84px]"
          }
        />
      </div>
      <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 text-center">
        <h1
          className={
            compact
              ? "text-base font-extrabold tracking-tight text-[#6B3F1D] sm:text-lg"
              : "text-3xl font-extrabold tracking-tight text-[#6B3F1D] sm:text-4xl"
          }
        >
          {mnAuth.appTitle}
        </h1>
        <p
          className={
            compact
              ? "text-[9px] font-medium leading-tight text-amber-900/75 sm:text-[10px]"
              : "text-xs font-medium text-amber-900/75 sm:text-sm"
          }
        >
          {mnAuth.tagline}
        </p>
      </div>
    </>
  );
}

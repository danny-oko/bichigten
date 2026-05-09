import Image from "next/image";

import { mnAuth } from "@/lib/i18n/mn-copy";

export function AuthHeader() {
  return (
    <>
      <div className="flex justify-center">
        <Image
          src="/icon.svg"
          alt={mnAuth.bearAlt}
          width={84}
          height={84}
          priority
          className="h-16 w-16 sm:h-[84px] sm:w-[84px]"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#6B3F1D] sm:text-4xl">
          {mnAuth.appTitle}
        </h1>
        <p className="text-xs font-medium text-amber-900/75 sm:text-sm">
          {mnAuth.tagline}
        </p>
      </div>
    </>
  );
}

import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-full w-full justify-center bg-[#ECE8D8] px-3 py-4 font-sans sm:px-6 sm:py-6">
      <div className="w-full max-w-md sm:max-w-xl">
        <div className="w-full space-y-3 rounded-3xl border border-amber-200/80 bg-white/90 px-4 pt-3 pb-4 shadow-xl shadow-amber-900/10 backdrop-blur sm:space-y-4 sm:px-6 sm:pt-4 sm:pb-6 [&_[data-slot=input]]:text-[#2a241e] [&_[data-slot=input]]:placeholder:text-[#6b5b4f] [&_[data-slot=input]]:caret-[#E8920A]">
          {children}
        </div>
      </div>
    </div>
  );
}

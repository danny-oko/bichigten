import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: ReactNode;
  /**
   * Fill parent height and clip overflow (use with a parent `h-full`, e.g. sign-up layout).
   * Avoids scrolling inside the app shell’s scroll container.
   */
  viewportLocked?: boolean;
};

export function AuthShell({ children, viewportLocked }: AuthShellProps) {
  return (
    <div
      className={cn(
        "bg-[#ECE8D8] font-['Avenir_Next_Rounded','Nunito','Quicksand','Trebuchet_MS',sans-serif]",
        viewportLocked
          ? "flex h-full max-h-full min-h-0 flex-col overflow-hidden"
          : "min-h-screen",
      )}
    >
      <section
        className={cn(
          "mx-auto flex w-full max-w-md items-center p-3 sm:max-w-xl sm:p-6",
          viewportLocked
            ? "h-full min-h-0 flex-1 justify-center overflow-hidden p-3 sm:p-6"
            : "min-h-screen",
        )}
      >
        <div
          className={cn(
            "w-full rounded-3xl backdrop-blur",
            viewportLocked
              ? "flex max-h-full min-h-0 flex-col gap-5 overflow-hidden border-0 bg-white/95 p-5 shadow-lg shadow-amber-900/10 ring-1 ring-amber-900/[0.06] sm:gap-6 sm:p-8"
              : "space-y-5 border border-amber-200/80 bg-white/90 p-4 shadow-xl shadow-amber-900/10 sm:space-y-6 sm:p-8",
          )}
        >
          {children}
        </div>
      </section>
    </div>
  );
}

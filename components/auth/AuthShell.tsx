import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-background px-4 py-10 font-sans sm:px-6">
      <div className="w-full max-w-[400px]">
        <div className="w-full space-y-6 rounded-2xl border border-border/50 bg-card px-6 py-8 shadow-[0_8px_30px_rgba(59,47,47,0.06)] sm:px-8 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

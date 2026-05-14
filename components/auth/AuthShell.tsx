import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#ECE8D8] font-sans">
      <section className="mx-auto flex min-h-screen w-full max-w-md items-center p-3 sm:max-w-xl sm:p-6">
        <div className="w-full space-y-5 rounded-3xl border border-amber-200/80 bg-white/90 p-4 shadow-xl shadow-amber-900/10 backdrop-blur sm:space-y-6 sm:p-8 [&_[data-slot=input]]:text-[#2a241e] [&_[data-slot=input]]:placeholder:text-[#6b5b4f] [&_[data-slot=input]]:caret-[#E8920A]">
          {children}
        </div>
      </section>
    </main>
  );
}

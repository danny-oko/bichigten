import type { ReactNode } from "react";

/** Locks sign-up to the viewport so the app scroll container does not scroll. */
export default function SignUpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full max-h-full min-h-0 overflow-hidden overscroll-none">
      {children}
    </div>
  );
}

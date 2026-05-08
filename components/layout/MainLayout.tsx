import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
  aside?: ReactNode;
};

export function MainLayout({ children, aside }: MainLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[1220px] px-4 pt-5 md:px-6 md:pt-8">
      <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5">
        <main className="min-w-0">{children}</main>
        <aside className="hidden min-w-0 md:block">
          {aside ? <div className="sticky top-6 space-y-4">{aside}</div> : null}
        </aside>
      </div>
    </div>
  );
}

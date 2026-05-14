import type { ReactNode } from "react";

type SidebarWidgetProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SidebarWidget({
  title,
  subtitle,
  children,
}: SidebarWidgetProps) {
  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent dark:border-[#37464f] p-5">
      <header className="mb-4 border-b border-[#ECE7DE] dark:border-[#37464f] pb-3">
        <h3 className="text-base font-extrabold text-[#1C2B4A] dark:text-[#f0f4f5]">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-[#4d4539] dark:text-[#9ba3a7]">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

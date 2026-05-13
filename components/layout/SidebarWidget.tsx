import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";

type SidebarWidgetProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export function SidebarWidget({
  title,
  subtitle,
  children,
}: SidebarWidgetProps) {
  return (
    <section className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-5">
      <header className="mb-4 border-b border-[#ECE7DE] pb-3">
        <h3 className="text-base font-extrabold text-[#1C2B4A]">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-[#6F6658]">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavLoading } from "../nav-loading-context";
import type { MenuLabel } from "./main-bars";
import { NavMenuIcon } from "./nav-menu-icon";

type HeaderClientProps = {
  menuLabels: readonly MenuLabel[];
  menuPaths: Record<MenuLabel, string>;
};

export const SideBar = ({ menuLabels, menuPaths }: HeaderClientProps) => {
  const pathname = usePathname();
  const { navigateTo } = useNavLoading();

  const active =
    menuLabels.find((label) => pathname.startsWith(menuPaths[label])) ??
    menuLabels[0];

  return (
    <aside
      className="hidden h-full shrink-0 flex-col border-r-2 py-5 md:flex md:w-20 md:px-2 lg:w-[360px] lg:px-3"
      aria-label="Main navigation"
    >
      <nav className="flex flex-1 flex-col gap-3 md:px-1 lg:p-4">
        <div className="flex w-full shrink-0 items-center justify-center pb-0.5 md:min-h-[48px] lg:pb-2">
          <Link
            href="/home"
            className="flex h-9 w-10 shrink-0 items-center justify-center md:h-10 md:w-11 lg:h-auto lg:w-auto lg:max-w-[176px]"
            aria-label="Нүүр хуудас — Mazaalai Learn"
          >
            <img
              src="/logo.png"
              alt=""
              width={454}
              height={184}
              className="h-auto w-full max-h-7 object-contain object-center md:max-h-8 lg:max-h-[72px]"
            />
          </Link>
        </div>
        {menuLabels.map((label) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => navigateTo(menuPaths[label])}
              className={`flex w-full items-center justify-start rounded-xl py-2.5 text-[16px] md:justify-center md:px-0 lg:min-h-[52px] lg:justify-start lg:gap-4 lg:px-3
              transition-all duration-150 font-balsamiq border-2
              ${
                isActive
                  ? "dark:bg-[#84d8ff]/15 dark:border-[#84d8ff] bg-[#ffad33]/10 border-[#ffad33] text-black dark:text-white"
                  : "text-[#777777] border-transparent dark:text-[#94a3b8]"
              }`}
            >
              <NavMenuIcon
                label={label}
                width={40}
                height={40}
                className="size-8 shrink-0 object-contain transition-all duration-200 md:size-9 lg:size-10"
              />
              <div className="hidden text-left text-[14px] font-extrabold uppercase leading-none tracking-wide whitespace-nowrap lg:block">
                {label}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

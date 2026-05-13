"use client";

import { usePathname } from "next/navigation";
import type { MenuLabel } from "./main-bars";
import { NavMenuIcon } from "./nav-menu-icon";
import { useNavLoading } from "../nav-loading-context";

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
      className="hidden h-full flex-col border-r-2 py-5 md:flex md:w-20 md:px-2 lg:w-[300px] lg:px-3 shrink-0"
      aria-label="Main navigation"
    >
      <div className="flex h-[60px] items-center justify-center px-2 lg:justify-start lg:px-5">
        <img
          src="/logo.png"
          alt="Mazaalai Learn"
          className="block h-8 w-auto object-contain md:h-9"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-3 md:px-1 lg:p-4">
        {menuLabels.map((label) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => navigateTo(menuPaths[label])}
              className={`flex w-full items-center justify-center rounded-xl py-2 text-[16px] md:px-0 lg:justify-start lg:gap-5 lg:px-4
              transition-all duration-150 font-balsamiq border-2
              ${
                isActive
                  ? "dark:bg-[#84d8ff]/15 dark:border-[#84d8ff] bg-[#ffad33]/10 border-[#ffad33] text-black"
                  : "text-[#777777] border-transparent dark:text-[#94a3b8]"
              }`}
            >
              <NavMenuIcon
                label={label}
                width={35}
                height={35}
                className="h-7 w-7 transition-all duration-200 md:h-8 md:w-8 lg:h-9 lg:w-9"
              />
              <div className="md:hidden lg:block uppercase text-[14px] font-extrabold tracking-wider">
                {label}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

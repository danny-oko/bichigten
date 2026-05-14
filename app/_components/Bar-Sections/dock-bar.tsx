"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MenuLabel } from "./main-bars";
import { NavMenuIcon } from "./nav-menu-icon";
import { useNavLoading } from "../nav-loading-context";

type DockBarProps = {
  menuLabels: readonly MenuLabel[];
  menuPaths: Record<MenuLabel, string>;
};

export const DockBar = ({ menuLabels, menuPaths }: DockBarProps) => {
  const pathname = usePathname();
  const { navigateTo } = useNavLoading();

  const active =
    menuLabels.find((label) => pathname.startsWith(menuPaths[label])) ??
    menuLabels[0];

  return (
    <nav
      className="fixed bottom-0 z-50 w-full md:hidden border-t-2"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around gap-1 p-3 shadow-xl backdrop-blur-md">
        {menuLabels.map((label) => {
          const isActive = active === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => navigateTo(menuPaths[label])}
              className={`flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200 rounded-4xl w-[60px] h-[60px] justify-center
                border 
                ${
                  isActive
                    ? "bg-[#84d8ff]/50 text-[#1cb0f6] border-[#84d8ff]"
                    : "text-[#777777] hover:bg-[#F2EEDD] border-transparent"
                }`}
            >
              <NavMenuIcon
                label={label}
                width={32}
                height={32}
                className="size-8 shrink-0 object-contain transition-all duration-200"
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

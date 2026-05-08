"use client";

import { useState } from "react";

type Tab = "weekly" | "alltime";

interface TabToggleProps {
  defaultTab?: Tab;
  onChange?: (tab: Tab) => void;
}

export default function TabToggle({
  defaultTab = "weekly",
  onChange,
}: TabToggleProps) {
  const [active, setActive] = useState<Tab>(defaultTab);

  function handleSelect(tab: Tab) {
    setActive(tab);
    onChange?.(tab);
  }

  return (
    <div className="flex mx-4 mt-4 bg-white rounded-full p-1 border border-[#E8D9C0]">
      <button
        onClick={() => handleSelect("weekly")}
        className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
          active === "weekly" ? "bg-[#E8940A] text-white" : "text-[#888]"
        }`}
      >
        Долоо хоног
      </button>
      <button
        onClick={() => handleSelect("alltime")}
        className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
          active === "alltime" ? "bg-[#E8940A] text-white" : "text-[#888]"
        }`}
      >
        Бүх цаг үеийн
      </button>
    </div>
  );
}

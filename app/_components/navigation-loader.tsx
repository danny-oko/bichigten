"use client";

import { Montserrat } from "next/font/google";
import LoadingScreen from "./loading-screen";
import { useNavLoading } from "./nav-loading-context";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const NavigationLoader = () => {
  const { isLoading } = useNavLoading();

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#fefae8] dark:bg-[#131f24] ${montserrat.className}`}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="w-[120px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[300px] aspect-square">
          <LoadingScreen />
        </div>
        <p className="text-lg font-black animate-pulse">Уншиж байна...</p>
      </div>
    </div>
  );
};

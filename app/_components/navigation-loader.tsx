"use client";

import LoadingScreen from "./loading-screen";
import { useNavLoading } from "./nav-loading-context";

export const NavigationLoader = () => {
  const { isLoading } = useNavLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#fef3c7] to-[#fffbeb] dark:from-[#020617] dark:to-[#0c2a36]">
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="w-[120px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[300px] aspect-square">
          <LoadingScreen />
        </div>
        <p className="text-lg font-black animate-pulse">Уншиж байна...</p>
      </div>
    </div>
  );
};

"use client";

import { createContext, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";

type NavLoadingContextType = {
  navigateTo: (path: string) => void;
  isLoading: boolean;
};

const NavLoadingContext = createContext<NavLoadingContextType>({
  navigateTo: () => {},
  isLoading: false,
});

export const NavLoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateTo = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <NavLoadingContext.Provider value={{ navigateTo, isLoading: isPending }}>
      {children}
    </NavLoadingContext.Provider>
  );
};

export const useNavLoading = () => useContext(NavLoadingContext);

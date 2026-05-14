import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Balsamiq_Sans, Dosis, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import localFont from "next/font/local";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme-storage";
import { ConditionalBars } from "./_components/Bar-Sections/conditional-bars";
import { NavLoadingProvider } from "./_components/nav-loading-context";
import { NavigationLoader } from "./_components/navigation-loader";

const mongolFont = localFont({
  src: "./font/cmdashitseden.ttf",
  variable: "--font-mongol",
});

const dosis = Dosis({
  variable: "--font-dosis",
  subsets: ["latin"],
});

const balsamiq = Balsamiq_Sans({
  variable: "--font-balsamiq",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mazaalai Learn",
  description: "Эх хэл бол үндэсний дархлаа юм",
  icons: {
    icon: "/bear.png",
    shortcut: "/bear.png",
    apple: "/bear.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="mn"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${mongolFont.variable} ${balsamiq.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-0 flex-row overflow-hidden font-sans">
        <Script
          id="theme-from-storage"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/home"
          signUpFallbackRedirectUrl="/home"
          prefetchUI={false}
        >
          <NavLoadingProvider>
            <NavigationLoader />
            <ConditionalBars />
            <main
              data-app-scroll-container
              className="min-h-0 min-w-0 flex-1 overflow-y-auto"
            >
              {children}
            </main>
          </NavLoadingProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

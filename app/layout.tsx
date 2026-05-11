import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Balsamiq_Sans, Dosis, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import localFont from "next/font/local";
import { ConditionalBars } from "./_components/Bar-Sections/conditional-bars";

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
      className={`${geistSans.variable} ${geistMono.variable} ${mongolFont.variable} ${balsamiq.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-0 flex-row overflow-hidden">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/home"
          signUpFallbackRedirectUrl="/home"
          prefetchUI={false}
        >
          <ConditionalBars />
          <main
            data-app-scroll-container
            className="min-h-0 min-w-0 flex-1 overflow-y-auto"
          >
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}

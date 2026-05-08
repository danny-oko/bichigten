"use client";

import { useRouter } from "next/navigation";

interface CtaBannerProps {
  message: string;
  buttonText: string;
  href?: string;
}

export default function CtaBanner({
  message,
  buttonText,
  href = "/map",
}: CtaBannerProps) {
  const router = useRouter();

  return (
    <div className="mx-4 mt-3 bg-[#E8940A] rounded-2xl px-4 pt-5 pb-4">
      <p className="text-sm text-[#FFF3DC] leading-relaxed max-w-[200px]">
        {message}
      </p>
      <button
        onClick={() => router.push(href)}
        className="mt-3 bg-[#7A4A0A] text-white text-xs font-bold tracking-wider uppercase rounded-full px-6 py-2"
      >
        {buttonText}
      </button>
    </div>
  );
}

"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  // Swipe down эхэлсэн Y position
  const startY = useRef<number | null>(null);

  // Sheet-ийг доош drag хийх хэмжээ
  const [dragY, setDragY] = useState(0);

  // Lock the app scroll root (<main>) — body is already overflow-hidden; real scroll is on main.
  useEffect(() => {
    if (!isOpen) return;

    const scrollRoot =
      (document.querySelector(
        "[data-app-scroll-container]",
      ) as HTMLElement | null) ?? document.documentElement;

    const prevOverflow = scrollRoot.style.overflow;
    const prevOverscroll = scrollRoot.style.overscrollBehavior;
    const scrollTop = scrollRoot.scrollTop;

    scrollRoot.style.overflow = "hidden";
    scrollRoot.style.overscrollBehavior = "none";

    return () => {
      scrollRoot.style.overflow = prevOverflow;
      scrollRoot.style.overscrollBehavior = prevOverscroll;
      scrollRoot.scrollTop = scrollTop;
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;

    const diff = e.touches[0].clientY - startY.current;

    // Зөвхөн доош drag хийхэд sheet хөдөлнө
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    // 100px-ээс их доош татвал хаана
    if (dragY > 100) {
      onClose();
    }

    setDragY(0);
    startY.current = null;
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden={!isOpen}
        className={[
          "fixed inset-0 z-40 touch-none overscroll-none bg-black/40 transition-opacity duration-300 xl:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Bottom sheet */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isOpen ? `translateY(${dragY}px)` : "translateY(100%)",
        }}
        className={[
          "fixed inset-x-0 bottom-0 z-50 xl:hidden",
          "max-h-[85vh] overflow-y-auto rounded-t-2xl",
          "bg-[#FFF8E7] p-4 shadow-[0_-20px_60px_rgba(59,47,47,0.25)]",
          "transition-transform duration-300",
        ].join(" ")}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d8bd8d]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white font-balsamiq font-bold text-[#3b2f2f] shadow"
          aria-label="Close bottom sheet"
        >
          ✕
        </button>

        {children}
      </div>
    </>
  );
};

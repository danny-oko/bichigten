"use client";

import Lottie from "lottie-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import congratsAnimation from "@/public/lottie/congrats.json";

import type { ReadingResult } from "../types/reading";

type ReadingResultDialogProps = {
  open: boolean;
  result: ReadingResult | null;
  requiredAccuracy: number | null;
  xpReward: number;
  onClose: () => void;
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-3 dark:border-[#84d8ff]/30">
    <p className="text-xs font-semibold text-amber-800">{label}</p>
    <p className="mt-1 text-xl font-semibold text-stone-950">{value}</p>
  </div>
);

export const ReadingResultDialog = ({
  open,
  result,
  requiredAccuracy,
  xpReward,
  onClose,
}: ReadingResultDialogProps) => {
  if (!result) return null;

  const passThreshold = requiredAccuracy ?? 0;
  const isPassed = result.accuracy >= passThreshold;
  const xpEarned = isPassed ? xpReward : 0;
  const title = isPassed ? "Баяр хүргэе!" : "Дахин оролдоорой";
  const description = isPassed
    ? "Та уншлагын дасгалаа амжилттай дуусгалаа."
    : "Оноо шаардлагад хүрсэнгүй. Дахин уншаад оноогоо ахиулаарай.";
  const statusText = isPassed ? "Шаардлага хангасан" : "Шаардлага хангаагүй";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-auto border-3 border-[#E8920A] bg-[#fffaf0] text-stone-900 shadow-[0_18px_60px_rgba(232,146,10,0.18)] sm:max-w-xl dark:border-[#84d8ff]/50">
        <DialogHeader>
          <div className="mx-auto h-28 w-28">
            {congratsAnimation ? (
              <Lottie
                animationData={congratsAnimation}
                loop={false}
                autoplay
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border-3 border-amber-300 text-4xl font-semibold text-amber-600">
                +
              </div>
            )}
          </div>
          <DialogTitle className="text-center text-2xl text-stone-950">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm font-medium text-stone-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard label="Зөв гүйцэтгэл" value={`${result.accuracy}%`} />
          <StatCard label="Алдаа" value={`${result.mistakes}`} />
          <StatCard label="Уншсан үг" value={`${result.wordsRead}`} />
          <StatCard label="Хурд (үг/минут)" value={`${result.wpm}`} />
          <StatCard label="Урамшуулал оноо" value={`${xpEarned} XP`} />
        </div>

        <div
          className={`rounded-xl border-3 p-4 text-sm font-semibold ${
            isPassed
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-orange-300 bg-orange-50 text-orange-800"
          }`}
        >
          {statusText} · шаардлага {passThreshold}%
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            Хаах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

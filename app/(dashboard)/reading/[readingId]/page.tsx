"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PracticeControlPanel } from "../components/PracticeControlPanel";
import { ReadingResultDialog } from "../components/ReadingResultDialog";
import { ReadingTextCard } from "../components/ReadingTextCard";
import { DEFAULT_READING_DURATION_SEC } from "../constants/readings";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import type { Reading, ReadingResult, ReadingStatus } from "../types/reading";

const getStatusLabel = (status: ReadingStatus): string => {
  switch (status) {
    case "recording":
      return "Бичиж байна";
    case "transcribing":
      return "Хөрвүүлж байна";
    case "done":
      return "Дууссан";
    case "error":
      return "Алдаа";
    case "idle":
    default:
      return "Бэлэн";
  }
};

type ReadingResultPanelProps = {
  error: string | null;
  recordingUrl: string | null;
  transcript: string;
};

const ReadingResultPanel = ({
  error,
  recordingUrl,
  transcript,
}: ReadingResultPanelProps) => {
  if (!error && !recordingUrl && !transcript) return null;

  return (
    <aside className="flex w-full flex-col gap-4">
      {error && (
        <section className="rounded-2xl border-3 border-red-300 bg-[#fff8ec] p-4 text-sm font-medium text-red-700 dark:border-red-500/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </section>
      )}

      {recordingUrl && (
        <section className="rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_10px_28px_rgba(232,146,10,0.1)] dark:border-[#84d8ff]/40 dark:bg-[#1e293b]/70 dark:shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
          <p className="mb-3 text-sm font-semibold text-stone-800 dark:text-[#e8e4dc]">
            Recorded audio
          </p>
          <audio
            controls
            src={recordingUrl}
            className="w-full"
            aria-label="Recorded reading audio"
          />
        </section>
      )}

      {transcript && (
        <section className="rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-5 dark:border-[#84d8ff]/40 dark:bg-[#1e293b]/70 dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <h2 className="text-base font-semibold text-stone-950 dark:text-[#f0ebe3]">
            Transcript
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-stone-700 dark:text-[#b8b0a4]">
            {transcript}
          </p>
        </section>
      )}
    </aside>
  );
};

const ReadingTestPage = () => {
  const params = useParams<{ readingId: string }>();
  const router = useRouter();
  const [reading, setReading] = useState<Reading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [startedReadingId, setStartedReadingId] = useState<string | null>(null);
  const [dismissedResult, setDismissedResult] = useState<ReadingResult | null>(
    null,
  );

  const {
    canStart,
    elapsedSeconds,
    error,
    isRecording,
    recordingUrl,
    result,
    secondsLeft,
    startRecording,
    status,
    stopRecording,
    transcript,
  } = useSpeechRecognition({
    durationSec: DEFAULT_READING_DURATION_SEC,
    targetId: reading?.id ?? null,
    targetTextCyrillic: reading?.cyrillicText ?? "",
  });

  useEffect(() => {
    const controller = new AbortController();
    const loadReading = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await fetch(`/api/reading/${params.readingId}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          setReading(null);
          setLoadError("Уншлага олдсонгүй");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load reading: ${res.status}`);
        }

        const data = (await res.json()) as Reading;
        setReading(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLoadError(
          err instanceof Error ? err.message : "Уншлага ачаалж чадсангүй",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadReading();

    return () => {
      controller.abort();
    };
  }, [params.readingId]);

  const handleStart = () => {
    setStartedReadingId(reading?.id ?? params.readingId);
    setDismissedResult(null);
    void startRecording();
  };

  const handleClose = () => {
    router.push("/reading");
  };

  const isResultDialogOpen = Boolean(result && dismissedResult !== result);
  const isReadingTextStarted = startedReadingId === reading?.id;
  const hasSideFeedback = Boolean(error || recordingUrl || transcript);

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-[#fffaf2]/70 px-4 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))] text-stone-900 md:pb-8 lg:px-10 dark:bg-[#0f1419] dark:text-[#e8e4dc]">
        <section className="rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 text-sm font-semibold text-stone-600 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-6 dark:border-[#84d8ff]/40 dark:bg-[#1e293b]/70 dark:text-[#b8b0a4] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          Уншлагыг ачаалж байна...
        </section>
      </main>
    );
  }

  if (!reading || loadError) {
    return (
      <main className="min-h-screen w-full bg-[#fffaf2]/70 px-4 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))] text-stone-900 md:pb-8 lg:px-10 dark:bg-[#0f1419] dark:text-[#e8e4dc]">
        <div className="rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-6 dark:border-[#84d8ff]/40 dark:bg-[#1e293b]/70 dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl font-semibold text-stone-950 dark:text-[#f0ebe3]">
            {loadError ?? "Уншлага олдсонгүй"}
          </h1>
          <Link
            href="/reading"
            className="mt-4 inline-flex rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 dark:bg-[#0ea5e9] dark:hover:bg-sky-400"
          >
            Буцах
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#fffaf2]/70 px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))] text-stone-900 md:pb-8 lg:px-10 dark:bg-[#0f1419] dark:text-[#e8e4dc]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 md:gap-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/reading"
              className="text-sm font-semibold text-amber-700 transition hover:text-amber-900 dark:text-[#fcd34d] dark:hover:text-[#fde68a]"
            >
              Буцах
            </Link>
            <h1 className="mt-2 hidden text-2xl font-semibold tracking-tight text-stone-950 sm:block sm:text-3xl lg:text-4xl dark:text-[#f0ebe3]">
              {reading.title}
            </h1>
          </div>

          <span className="hidden w-fit rounded-full border-3 border-[#E8920A] bg-transparent px-4 py-2 text-sm font-semibold text-amber-900 sm:inline-flex dark:border-[#84d8ff] dark:text-[#e8e4dc]">
            {getStatusLabel(status)}
          </span>
        </header>

        <div
          className={`grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_400px] ${
            hasSideFeedback ? "lg:items-start" : "lg:items-stretch"
          }`}
        >
          <div className="order-2 flex min-w-0 flex-col gap-5 lg:order-1">
            <ReadingTextCard
              canStart={canStart}
              text={reading.traditionalText}
              isRecording={isRecording}
              isStarted={isReadingTextStarted}
              durationSec={DEFAULT_READING_DURATION_SEC}
              requiredAccuracy={reading.requiredAccuracy}
              secondsLeft={secondsLeft}
              status={status}
              xpReward={reading.xpReward}
              wordsCount={reading.wordsCount}
              onStart={handleStart}
              onStop={stopRecording}
            />

            <ReadingResultPanel
              error={error}
              recordingUrl={recordingUrl}
              transcript={transcript}
            />
          </div>

          <PracticeControlPanel
            className="hidden lg:order-2 lg:block"
            canStart={canStart}
            durationSec={DEFAULT_READING_DURATION_SEC}
            elapsedSeconds={elapsedSeconds}
            isRecording={isRecording}
            requiredAccuracy={reading.requiredAccuracy}
            secondsLeft={secondsLeft}
            status={status}
            wordsCount={reading.wordsCount}
            xpReward={reading.xpReward}
            onStart={handleStart}
            onStop={stopRecording}
          />
        </div>
      </div>

      <ReadingResultDialog
        open={isResultDialogOpen}
        result={result}
        requiredAccuracy={reading.requiredAccuracy}
        xpReward={reading.xpReward}
        onClose={handleClose}
      />
    </main>
  );
};

export default ReadingTestPage;

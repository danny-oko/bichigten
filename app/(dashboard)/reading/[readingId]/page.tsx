"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  result: ReadingResult | null;
  transcript: string;
};

const ReadingResultPanel = ({
  error,
  result,
  transcript,
}: ReadingResultPanelProps) => {
  if (!error && !transcript && !result) return null;

  return (
    <aside className="flex max-h-none w-full flex-col gap-4 overflow-visible lg:h-[calc(100vh-220px)] lg:max-h-[640px] lg:overflow-auto">
      {error && (
        <section className="rounded-2xl border-3 border-red-300 bg-transparent p-4 text-sm font-medium text-red-700 dark:border-red-500/50 dark:text-red-300">
          {error}
        </section>
      )}

      {transcript && (
        <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40">
          <h2 className="text-base font-semibold text-stone-950">
            Transcript
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-stone-700">
            {transcript}
          </p>
        </section>
      )}

      {result && (
        <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40">
          <h2 className="text-base font-semibold text-stone-950">
            Local score result
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-4 dark:border-[#84d8ff]/30">
              <p className="text-sm text-amber-800">Accuracy</p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {result.accuracy}%
              </p>
            </div>
            <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-4 dark:border-[#84d8ff]/30">
              <p className="text-sm text-amber-800">Coverage</p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {result.coverage}%
              </p>
            </div>
            <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-4 dark:border-[#84d8ff]/30">
              <p className="text-sm text-amber-800">Final score</p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {result.finalScore}%
              </p>
            </div>
            <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-4 dark:border-[#84d8ff]/30">
              <p className="text-sm text-amber-800">WPM</p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {result.wpm}
              </p>
            </div>
            <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-4 dark:border-[#84d8ff]/30">
              <p className="text-sm text-amber-800">Words read</p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {result.wordsRead}
              </p>
            </div>
            <div className="rounded-xl border-3 border-amber-200/80 bg-transparent p-4 dark:border-[#84d8ff]/30">
              <p className="text-sm text-amber-800">Mistakes</p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {result.mistakes}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
            <p>Correct words: {result.correctWords}</p>
            <p>Total words: {result.totalWords}</p>
            <p>Missing words: {result.missingWords}</p>
            <p>Extra words: {result.extraWords}</p>
          </div>
        </section>
      )}
    </aside>
  );
};

const ReadingTestPage = () => {
  const params = useParams<{ readingId: string }>();
  const [reading, setReading] = useState<Reading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    canStart,
    elapsedSeconds,
    error,
    hasFeedback,
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

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-transparent px-6 py-6 text-stone-900 lg:px-10">
        <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-6 text-sm font-semibold text-stone-600 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40">
          Уншлагыг ачаалж байна...
        </section>
      </main>
    );
  }

  if (!reading || loadError) {
    return (
      <main className="min-h-screen w-full bg-transparent px-6 py-6 text-stone-900 lg:px-10">
        <div className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-6 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40">
          <h1 className="text-2xl font-semibold text-stone-950">
            {loadError ?? "Уншлага олдсонгүй"}
          </h1>
          <Link
            href="/reading"
            className="mt-4 inline-flex rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Буцах
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent px-6 py-4 text-stone-900 lg:px-10">
      <div className="flex w-full flex-col gap-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/reading"
              className="text-sm font-semibold text-amber-700 transition hover:text-amber-900"
            >
              Буцах
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              {reading.title}
            </h1>
          </div>

          <span className="w-fit rounded-full border-3 border-[#E8920A] bg-transparent px-4 py-2 text-sm font-semibold text-amber-900 dark:border-[#84d8ff] dark:text-[#e8e4dc]">
            {getStatusLabel(status)}
          </span>
        </header>

        <div
          className={`grid w-full gap-6 lg:items-start ${
            hasFeedback
              ? "lg:grid-cols-[minmax(260px,360px)_420px_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(260px,360px)_420px]"
          }`}
        >
          <section className="flex h-[60vh] min-h-[360px] w-full max-w-full flex-col rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 shadow-[0_8px_24px_rgba(232,146,10,0.08)] lg:h-[calc(100vh-220px)] lg:min-h-[420px] lg:max-h-[640px] dark:border-[#84d8ff]/40">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-stone-950">
                Унших эх
              </h2>
            </div>

            <p className="mongol-script  text-2xl min-h-0 flex-1 overflow-auto whitespace-pre-wrap leading-9 text-stone-800">
              {reading.traditionalText}
            </p>
          </section>

          <section className="w-full rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-1">
              <div className="rounded-2xl border-3 border-[#E8920A]/50 bg-transparent p-5 dark:border-[#84d8ff]/30">
                <p className="text-sm font-medium text-amber-800">
                  60-second countdown
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-5xl font-semibold tabular-nums text-stone-950">
                    {secondsLeft}
                  </span>
                  <span className="pb-2 text-sm font-medium text-stone-500">
                    seconds left
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${(elapsedSeconds / DEFAULT_READING_DURATION_SEC) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:min-w-44">
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={!canStart}
                  className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
                >
                  Start
                </button>

                {isRecording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="rounded-full border-3 border-stone-300 bg-transparent px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-[#E8920A] hover:text-amber-800 dark:border-[#475569] dark:text-[#e8e4dc]"
                  >
                    Finish early
                  </button>
                )}
              </div>
            </div>

            {recordingUrl && (
              <div className="mt-5 rounded-2xl border-3 border-[#E8920A]/50 bg-transparent p-4 dark:border-[#84d8ff]/30">
                <p className="mb-3 text-sm font-semibold text-stone-800">
                  Recorded audio
                </p>
                <audio
                  controls
                  src={recordingUrl}
                  className="w-full"
                  aria-label="Recorded reading audio"
                />
              </div>
            )}
          </section>

          <ReadingResultPanel
            error={error}
            result={result}
            transcript={transcript}
          />
        </div>
      </div>
    </main>
  );
};

export default ReadingTestPage;

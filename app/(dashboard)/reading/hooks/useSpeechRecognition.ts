"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { calculateReadingScore } from "../lib/calculateReadingScore";
import type {
  ReadingResult,
  ReadingStatus,
  TranscribeResponse,
} from "../types/reading";
import { useReadingTimer } from "./useReadingTimer";

type UseSpeechRecognitionOptions = {
  durationSec: number;
  targetId: string | null;
  targetTextCyrillic: string;
};

const getSupportedMimeType = () => {
  if (typeof MediaRecorder === "undefined") return undefined;

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
};

const getAudioExtension = (audioType: string) => {
  if (audioType.includes("webm")) return "webm";
  if (audioType.includes("mp4")) return "mp4";
  if (audioType.includes("ogg")) return "ogg";
  return "audio";
};

export const useSpeechRecognition = ({
  durationSec,
  targetId,
  targetTextCyrillic,
}: UseSpeechRecognitionOptions) => {
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingUrlRef = useRef<string | null>(null);
  const stopRecordingRef = useRef<() => void>(() => {});
  const isMountedRef = useRef(false);
  const isStoppingRef = useRef(false);

  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<ReadingStatus>("idle");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopRecordingFromTimer = useCallback(() => {
    stopRecordingRef.current();
  }, []);

  const {
    secondsLeft,
    elapsedSeconds,
    elapsedRef,
    startTimer,
    stopTimer,
    resetTimer,
  } = useReadingTimer({
    durationSec,
    onComplete: stopRecordingFromTimer,
  });

  const isBusy = status === "recording" || status === "transcribing";
  const canStart = !isBusy;
  const hasFeedback = Boolean(error || transcript || result);

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    if (isMountedRef.current) {
      setIsRecording(false);
    }
  }, []);

  const transcribeAndScore = useCallback(
    async (blob: Blob, durationSec: number) => {
      if (!isMountedRef.current) return;

      setStatus("transcribing");
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 130_000);

      try {
        if (blob.size === 0) {
          throw new Error("Recording is empty. Please try recording again.");
        }

        const audioType = blob.type || "audio/webm";
        const extension = getAudioExtension(audioType);
        const formData = new FormData();
        formData.append(
          "audio",
          new File([blob], `recording.${extension}`, {
            type: audioType,
          }),
        );

        const res = await fetch("/api/ai-chimege", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        const data = (await res.json()) as TranscribeResponse;
        if (!res.ok) {
          throw new Error(
            data.error || `Transcription failed with status ${res.status}`,
          );
        }

        if (typeof data.data !== "string") {
          throw new Error("Transcription response did not include text.");
        }

        if (!isMountedRef.current) return;

        setTranscript(data.data);

        const localResult = calculateReadingScore(
          targetTextCyrillic,
          data.data,
          durationSec,
        );

        setResult(localResult);

        if (targetId) {
          const attemptRes = await fetch("/api/reading-attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              targetId,
              transcribedText: data.data,
              durationSec,
            }),
          });

          if (!attemptRes.ok) {
            throw new Error(`Attempt save failed: ${attemptRes.status}`);
          }
        }

        setStatus("done");
      } catch (err) {
        if (!isMountedRef.current) return;

        const message =
          err instanceof DOMException && err.name === "AbortError"
            ? "Transcription timed out. Please try a shorter recording or try again."
            : err instanceof Error
              ? err.message
              : "Transcription failed";
        setError(message);
        setStatus("error");
      } finally {
        window.clearTimeout(timeoutId);
      }
    },
    [targetId, targetTextCyrillic],
  );

  const stopRecording = useCallback(() => {
    stopTimer();
    const recorder = mediaRecorderRef.current;

    if (isStoppingRef.current) {
      return;
    }

    if (!recorder || recorder.state === "inactive") {
      stopMedia();
      return;
    }

    isStoppingRef.current = true;

    recorder.onstop = () => {
      try {
        const elapsed = elapsedRef.current;
        const audioType =
          recorder.mimeType || audioChunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: audioType });

        if (process.env.NODE_ENV === "development") {
          console.log("Recording blob:", {
            size: blob.size,
            type: blob.type,
            durationSec: Math.max(elapsed, 1),
            chunks: audioChunksRef.current.length,
          });
        }

        if (recordingUrlRef.current) {
          URL.revokeObjectURL(recordingUrlRef.current);
        }
        const url = URL.createObjectURL(blob);
        recordingUrlRef.current = url;
        if (isMountedRef.current) {
          setRecordingUrl(url);
        }
        void transcribeAndScore(blob, Math.max(elapsed, 1));
      } finally {
        isStoppingRef.current = false;
        stopMedia();
      }
    };

    if (typeof recorder.requestData === "function") {
      recorder.requestData();
    }
    recorder.stop();
  }, [elapsedRef, stopMedia, stopTimer, transcribeAndScore]);

  const startRecording = useCallback(async () => {
    if (!canStart) return;

    setError(null);
    setResult(null);
    setTranscript("");
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
      recordingUrlRef.current = null;
    }
    setRecordingUrl(null);
    resetTimer();
    isStoppingRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = ({ data }: BlobEvent) => {
        if (data.size > 0) audioChunksRef.current.push(data);
      };

      recorder.onerror = () => {
        if (!isMountedRef.current) return;

        setError("Recording failed. Please try again.");
        setStatus("error");
        stopTimer();
        stopMedia();
      };

      recorder.start(1000);
      setIsRecording(true);
      setStatus("recording");
      startTimer();
    } catch (err) {
      if (!isMountedRef.current) return;

      setError(err instanceof Error ? err.message : "Microphone access denied");
      setStatus("error");
      stopMedia();
    }
  }, [canStart, resetTimer, startTimer, stopMedia, stopTimer]);

  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      stopTimer();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (recordingUrlRef.current) {
        URL.revokeObjectURL(recordingUrlRef.current);
        recordingUrlRef.current = null;
      }
      mediaRecorderRef.current = null;
    };
  }, [stopTimer]);

  return {
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
  };
};

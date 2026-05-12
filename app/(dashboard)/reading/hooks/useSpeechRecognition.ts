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
  targetTextCyrillic: string;
};

export const useSpeechRecognition = ({
  durationSec,
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
      try {
        const formData = new FormData();
        formData.append(
          "audio",
          new File([blob], "recording.wav", { type: "audio/wav" }),
        );

        const res = await fetch("/api/ai-chimege", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);

        const data = (await res.json()) as TranscribeResponse;
        if (!isMountedRef.current) return;

        setTranscript(data.data);

        const localResult = calculateReadingScore(
          targetTextCyrillic,
          data.data,
          durationSec,
        );

        setResult(localResult);
        setStatus("done");
      } catch (err) {
        if (!isMountedRef.current) return;

        setError(err instanceof Error ? err.message : "Transcription failed");
        setStatus("error");
      }
    },
    [targetTextCyrillic],
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
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
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

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = ({ data }: BlobEvent) => {
        if (data.size > 0) audioChunksRef.current.push(data);
      };

      recorder.start();
      setIsRecording(true);
      setStatus("recording");
      startTimer();
    } catch (err) {
      if (!isMountedRef.current) return;

      setError(err instanceof Error ? err.message : "Microphone access denied");
      setStatus("error");
      stopMedia();
    }
  }, [canStart, resetTimer, startTimer, stopMedia]);

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

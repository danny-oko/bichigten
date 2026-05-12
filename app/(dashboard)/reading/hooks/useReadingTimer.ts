"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseReadingTimerOptions = {
  durationSec: number;
  onComplete: () => void;
};

export const useReadingTimer = ({
  durationSec,
  onComplete,
}: UseReadingTimerOptions) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const elapsedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    elapsedRef.current = 0;
    setSecondsLeft(durationSec);
  }, [durationSec, stopTimer]);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          onCompleteRef.current();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    secondsLeft,
    elapsedSeconds: durationSec - secondsLeft,
    elapsedRef,
    startTimer,
    stopTimer,
    resetTimer,
  };
};

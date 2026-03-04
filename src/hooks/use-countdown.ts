import { useEffect, useRef, useState } from "react";

export function useCountdown(storageKey: string, initialSeconds: number = 30) {
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. On mount check if a timer is already running in the background
  useEffect(() => {
    const storedEndTime = localStorage.getItem(storageKey);
    if (storedEndTime) {
      const remaining = Math.round(
        (parseInt(storedEndTime) - Date.now()) / 1000,
      );

      if (remaining > 0) {
        startTimer(remaining);
      } else {
        localStorage.removeItem(storageKey);
      }
    } else {
      // If there is no timer in memory, start one automatically
      startTimer(initialSeconds);
    }
  }, [storageKey, initialSeconds]);

  // 2. The function to actually start the ticking
  const startTimer = (seconds: number) => {
    // Save the future exact time where the button can be clicked again
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem(storageKey, endTime.toString());
    setTimeLeft(seconds);

    // Clear any existing intervals just to be safe
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const remaining = Math.round((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        setTimeLeft(0);
        localStorage.removeItem(storageKey);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
  };

  return { timeLeft, startTimer };
}

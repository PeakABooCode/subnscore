//For your Custom Hooks
import { useState, useEffect } from "react";
import { QUARTER_SECONDS } from "../utils/helpers";

export function useTimer() {
  const [clock, setClock] = useState(QUARTER_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  // --- Clock Logic ---
  useEffect(() => {
    let interval;
    if (isRunning && clock > 0) {
      interval = setInterval(() => setClock((c) => c - 1), 1000);
    } else if (clock === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, clock]);

  return { clock, setClock, isRunning, setIsRunning };
}

//For helper functions

// --- Constants & Helpers ---
export const QUARTER_MINUTES = 10;
export const QUARTER_SECONDS = QUARTER_MINUTES * 60;

export const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

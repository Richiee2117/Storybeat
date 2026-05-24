import { useState, useEffect } from "react";
import type { Beat } from "../types";
import { SEED_BEATS } from "../data";
import { reorder } from "../utils";

const STORAGE_KEY = "storybeats-v2";

function loadFromStorage(): Beat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Beat[]) : SEED_BEATS;
  } catch {
    return SEED_BEATS;
  }
}

export function useBeats() {
  const [beats, setBeats] = useState<Beat[]>(loadFromStorage);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beats));
  }, [beats]);

  function addBeat(beat: Beat) {
    setBeats((prev) => [...prev, beat]);
  }

  function updateBeat(beat: Beat) {
    setBeats((prev) => prev.map((b) => (b.id === beat.id ? beat : b)));
  }

  function deleteBeat(id: string) {
    setBeats((prev) => prev.filter((b) => b.id !== id));
  }

  function moveBeat(fromIndex: number, toIndex: number) {
    setBeats((prev) => reorder(prev, fromIndex, toIndex));
  }

  return { beats, addBeat, updateBeat, deleteBeat, moveBeat };
}

import { useState } from "react";
import { TRANSLATIONS } from "./translations";
import type { Lang } from "./translations";

const STORAGE_KEY = "storybeats-lang";

function loadLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "es") return saved;
  // Auto-detect from browser
  return navigator.language.startsWith("es") ? "es" : "en";
}

export function useLang() {
  const [lang, setLang] = useState<Lang>(loadLang);

  function toggleLang() {
    const next: Lang = lang === "en" ? "es" : "en";
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const t = TRANSLATIONS[lang];

  return { lang, toggleLang, t };
}

import type { ActConfig, ActId, BeatType, Beat } from "../types";

// ─── Act Configuration ────────────────────────────────────────────────────────
// Labels are now injected at render time from i18n — only visual tokens live here.

export const ACT_CONFIG: Record<ActId, ActConfig> = {
  setup: {
    label: "Setup",        // fallback only — overridden by i18n
    color: "#b8a99a",
    bg: "#f7f2ec",
    accent: "#7a6858",
  },
  confrontation: {
    label: "Confrontation",
    color: "#b07a5a",
    bg: "#f9f0e8",
    accent: "#7a4e2d",
  },
  resolution: {
    label: "Resolution",
    color: "#7a9a8a",
    bg: "#eef4f0",
    accent: "#3d6b58",
  },
};

export const ACT_ORDER: ActId[] = ["setup", "confrontation", "resolution"];

// ─── Beat Types ───────────────────────────────────────────────────────────────
// Labels injected from i18n at render time; symbol is language-agnostic.

export const BEAT_TYPES: BeatType[] = [
  { id: "inciting",   label: "Inciting Incident", symbol: "◈" },
  { id: "turn",       label: "Turning Point",     symbol: "◆" },
  { id: "revelation", label: "Revelation",        symbol: "◉" },
  { id: "choice",     label: "Choice",            symbol: "◇" },
  { id: "escalation", label: "Escalation",        symbol: "△" },
  { id: "climax",     label: "Climax",            symbol: "★" },
  { id: "aftermath",  label: "Aftermath",         symbol: "◎" },
  { id: "beat",       label: "Scene Beat",        symbol: "·" },
];

// ─── Seed Beats ───────────────────────────────────────────────────────────────

export const SEED_BEATS: Beat[] = [
  {
    id: "1",
    title: "The Letter Arrives",
    type: "inciting",
    act: "setup",
    note: "A sealed envelope — no return address. The wax is still warm.",
    tension: 2,
  },
  {
    id: "2",
    title: "She Opens It",
    type: "choice",
    act: "setup",
    note: "Three days she doesn't open it. On the fourth, she does.",
    tension: 3,
  },
  {
    id: "3",
    title: "The Name Inside",
    type: "revelation",
    act: "confrontation",
    note: "A name she thought she'd buried. A debt she thought was settled.",
    tension: 6,
  },
  {
    id: "4",
    title: "Old Allies",
    type: "turn",
    act: "confrontation",
    note: "Two of them won't help. One will — but at a cost she hasn't named yet.",
    tension: 5,
  },
  {
    id: "5",
    title: "The Crossing",
    type: "escalation",
    act: "confrontation",
    note: "The bridge is the last neutral ground. After this, there are no sides — only her and him.",
    tension: 8,
  },
  {
    id: "6",
    title: "Everything Burns",
    type: "climax",
    act: "resolution",
    note: "Not a metaphor. The archive. Ten years of silence, ash.",
    tension: 10,
  },
  {
    id: "7",
    title: "What Remains",
    type: "aftermath",
    act: "resolution",
    note: "She keeps just one page. She doesn't read it again.",
    tension: 4,
  },
];

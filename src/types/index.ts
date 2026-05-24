// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ActId = "setup" | "confrontation" | "resolution";

export type BeatTypeId =
  | "inciting"
  | "turn"
  | "revelation"
  | "choice"
  | "escalation"
  | "climax"
  | "aftermath"
  | "beat";

export interface Beat {
  id: string;
  title: string;
  type: BeatTypeId;
  act: ActId;
  note: string;
  tension: number; // 1–10
}

// ─── Config Types ─────────────────────────────────────────────────────────────

export interface ActConfig {
  label: string;
  color: string;
  bg: string;
  accent: string;
}

export interface BeatType {
  id: BeatTypeId;
  label: string;
  symbol: string;
}

// ─── UI / State Types ─────────────────────────────────────────────────────────

export type ModalState = "new" | Beat | null;

export type FilterId = ActId | "all";

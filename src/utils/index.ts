import { BEAT_TYPES, ACT_CONFIG } from "../data";
import type { BeatTypeId, ActId } from "../types";
import type { T } from "../i18n";

// ─── ID Generation ────────────────────────────────────────────────────────────

export const uid = (): string => Math.random().toString(36).slice(2, 9);

// ─── Lookup Helpers ───────────────────────────────────────────────────────────

export function getBeatType(id: BeatTypeId) {
  return BEAT_TYPES.find((t) => t.id === id) ?? BEAT_TYPES[BEAT_TYPES.length - 1];
}

/** Returns beat type with translated label */
export function getBeatTypeWithT(id: BeatTypeId, t: T) {
  const base = getBeatType(id);
  const labelMap: Record<BeatTypeId, string> = {
    inciting:   t.typeInciting,
    turn:       t.typeTurn,
    revelation: t.typeRevelation,
    choice:     t.typeChoice,
    escalation: t.typeEscalation,
    climax:     t.typeClimax,
    aftermath:  t.typeAftermath,
    beat:       t.typeBeat,
  };
  return { ...base, label: labelMap[id] };
}

export function getActConfig(id: ActId) {
  return ACT_CONFIG[id] ?? ACT_CONFIG.setup;
}

/** Returns act config with translated label */
export function getActConfigWithT(id: ActId, t: T) {
  const base = getActConfig(id);
  const labelMap: Record<ActId, string> = {
    setup:         t.actSetup,
    confrontation: t.actConfrontation,
    resolution:    t.actResolution,
  };
  return { ...base, label: labelMap[id] };
}

// ─── Array Helpers ────────────────────────────────────────────────────────────

export function reorder<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

import { useState } from "react";
import type { Beat, FilterId } from "../types";
import { ACT_CONFIG, ACT_ORDER } from "../data";
import type { T, Lang } from "../i18n";
import { TensionArc } from "./TensionArc";

interface Props {
  beats: Beat[];
  activeFilter: FilterId;
  lang: Lang;
  t: T;
  onFilterChange: (f: FilterId) => void;
  onAddBeat: () => void;
  onToggleLang: () => void;
}

export function AppHeader({ beats, activeFilter, lang, t, onFilterChange, onAddBeat, onToggleLang }: Props) {
  const beatsByAct = beats.reduce<Record<string, number>>((acc, b) => {
    acc[b.act] = (acc[b.act] ?? 0) + 1;
    return acc;
  }, {});

  const actLabels: Record<string, string> = {
    setup: t.actSetup,
    confrontation: t.actConfrontation,
    resolution: t.actResolution,
  };

  const filters: Array<{
    id: FilterId;
    label: string;
    conf?: (typeof ACT_CONFIG)[keyof typeof ACT_CONFIG];
  }> = [
    { id: "all", label: `${t.filterAll} · ${beats.length}` },
    ...ACT_ORDER.map((k) => ({
      id: k as FilterId,
      label: `${actLabels[k]} · ${beatsByAct[k] ?? 0}`,
      conf: ACT_CONFIG[k],
    })),
  ];

  return (
    <header style={{
      background: "linear-gradient(180deg, #fffefb 0%, #fdfaf4 100%)",
      borderBottom: "1px solid #e0d4c4",
      padding: "16px 36px",
      display: "flex",
      alignItems: "center",
      gap: 20,
      flexShrink: 0,
      boxShadow: "0 2px 16px rgba(60,35,15,0.07)",
      position: "relative",
      zIndex: 10,
    }}>
      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 9,
          background: "linear-gradient(135deg, #c8a882, #8a6040)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(100,60,20,0.2)",
          flexShrink: 0,
        }}>
          <span style={{ color: "#fff", fontSize: 17, lineHeight: 1, fontFamily: "'IM Fell English SC', serif" }}>✦</span>
        </div>
        <div>
          <div style={{
            fontFamily: "'IM Fell English SC', Georgia, serif",
            fontSize: 20,
            color: "#241c14",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}>
            {t.appTitle}
          </div>
          <div style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: 11,
            color: "#b0987c",
            letterSpacing: "0.12em",
            marginTop: 2,
            textTransform: "uppercase",
          }}>
            {t.appSubtitle}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 32, background: "#e0d4c4", flexShrink: 0 }} />

      {/* Tension sparkline */}
      <div style={{ opacity: 0.9 }}>
        <TensionArc beats={beats} />
      </div>

      {/* Filter pills */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
        {filters.map((f) => {
          const active = activeFilter === f.id;
          return (
            <FilterPill
              key={f.id}
              label={f.label}
              active={active}
              color={f.conf?.color}
              bg={f.conf?.bg}
              accent={f.conf?.accent}
              onClick={() => onFilterChange(f.id)}
            />
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#e0d4c4", flexShrink: 0 }} />

      {/* Language toggle */}
      <LangToggle lang={lang} onClick={onToggleLang} />

      {/* Add beat button */}
      <AddButton label={t.addBeat} onClick={onAddBeat} />
    </header>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FilterPillProps {
  label: string;
  active: boolean;
  color?: string;
  bg?: string;
  accent?: string;
  onClick: () => void;
}

function FilterPill({ label, active, color, bg, accent, onClick }: FilterPillProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "5px 13px",
        borderRadius: 20,
        border: `1px solid ${active ? (color ?? "#b07a5a") : hovered ? "#cfc0ac" : "#e4d5c5"}`,
        background: active ? (bg ?? "rgba(176,122,90,0.12)") : hovered ? "rgba(255,255,255,0.7)" : "transparent",
        color: active ? (accent ?? "#7a4e2d") : hovered ? "#7a6858" : "#a09080",
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        letterSpacing: "0.04em",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function LangToggle({ lang, onClick }: { lang: Lang; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [flipping, setFlipping] = useState(false);

  function handleClick() {
    setFlipping(true);
    setTimeout(() => setFlipping(false), 400);
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={lang === "en" ? "Cambiar a Español" : "Switch to English"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 12px",
        borderRadius: 8,
        border: `1px solid ${hovered ? "#c4b0a0" : "#e0d4c8"}`,
        background: hovered ? "rgba(176,122,90,0.08)" : "rgba(255,255,255,0.6)",
        cursor: "pointer",
        transition: "all 0.18s ease",
        flexShrink: 0,
      }}
    >
      <span style={{
        fontSize: 15,
        lineHeight: 1,
        display: "block",
        transition: "transform 0.2s ease",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}>
        {lang === "en" ? "🇺🇸" : "🇲🇽"}
      </span>
      <span className={flipping ? "lang-flip" : ""} style={{
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 12,
        color: hovered ? "#6e4e30" : "#9a8070",
        letterSpacing: "0.08em",
        fontWeight: 600,
        textTransform: "uppercase",
        minWidth: 20,
        textAlign: "center",
      }}>
        {lang === "en" ? "EN" : "ES"}
      </span>
      <span style={{
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 10,
        color: "#c0a898",
        letterSpacing: "0.06em",
      }}>
        {lang === "en" ? "ES →" : "EN →"}
      </span>
    </button>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 20px",
        borderRadius: 8,
        border: `1px solid ${hovered ? "rgba(140,80,30,0.5)" : "rgba(176,122,90,0.35)"}`,
        background: hovered
          ? "linear-gradient(135deg, rgba(192,130,80,0.2), rgba(150,90,40,0.18))"
          : "linear-gradient(135deg, rgba(192,130,80,0.1), rgba(150,90,40,0.08))",
        color: hovered ? "#5e3818" : "#7a4e2d",
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.04em",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 12px rgba(120,70,20,0.12)" : "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

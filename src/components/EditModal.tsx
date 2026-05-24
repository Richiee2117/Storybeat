import { useState, useRef, useEffect } from "react";
import type { Beat, ActId, BeatTypeId } from "../types";
import { ACT_CONFIG, BEAT_TYPES, ACT_ORDER } from "../data";
import type { T } from "../i18n";
import { uid, getActConfig } from "../utils";

interface Props {
  beat: Beat | null;
  t: T;
  onSave: (beat: Beat) => void;
  onClose: () => void;
}

export function EditModal({ beat, t, onSave, onClose }: Props) {
  const isNew = !beat;
  const [title, setTitle]     = useState(beat?.title ?? "");
  const [note, setNote]       = useState(beat?.note ?? "");
  const [type, setType]       = useState<BeatTypeId>(beat?.type ?? "beat");
  const [act, setAct]         = useState<ActId>(beat?.act ?? "setup");
  const [tension, setTension] = useState(beat?.tension ?? 5);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => titleRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, []);

  function handleSave() {
    if (!title.trim()) return;
    onSave({ id: beat?.id ?? uid(), title: title.trim(), note, type, act, tension });
  }

  const actConf = getActConfig(act);

  const actLabels: Record<ActId, string> = {
    setup: t.actSetup,
    confrontation: t.actConfrontation,
    resolution: t.actResolution,
  };

  const typeLabels: Record<BeatTypeId, string> = {
    inciting:   t.typeInciting,
    turn:       t.typeTurn,
    revelation: t.typeRevelation,
    choice:     t.typeChoice,
    escalation: t.typeEscalation,
    climax:     t.typeClimax,
    aftermath:  t.typeAftermath,
    beat:       t.typeBeat,
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(20,12,6,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "fadeIn 0.18s ease",
      }}
    >
      <div style={{
        background: "linear-gradient(180deg, #fffefb 0%, #fdfaf5 100%)",
        border: "1px solid #ddd0c0",
        borderRadius: 16,
        width: "100%",
        maxWidth: 500,
        boxShadow: "0 32px 80px rgba(30,15,5,0.28), 0 4px 16px rgba(30,15,5,0.12)",
        animation: "modalUp 0.3s cubic-bezier(.22,1,.36,1)",
        overflow: "hidden",
      }}>
        {/* Coloured top bar for current act */}
        <div style={{
          height: 5,
          background: `linear-gradient(90deg, ${actConf.color}, ${actConf.accent})`,
          transition: "background 0.3s ease",
        }} />

        <div style={{ padding: "28px 32px 32px" }}>
          {/* Header */}
          <div style={{
            fontFamily: "'IM Fell English SC', Georgia, serif",
            fontSize: 19,
            color: "#241c14",
            marginBottom: 22,
            letterSpacing: "0.04em",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {isNew ? t.modalNewTitle : t.modalEditTitle}
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#b0987c", fontSize: 22, lineHeight: 1, padding: "0 2px",
              transition: "color 0.15s, transform 0.15s",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#7a4e2d"; (e.target as HTMLElement).style.transform = "rotate(90deg)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "#b0987c"; (e.target as HTMLElement).style.transform = "rotate(0deg)"; }}
            >×</button>
          </div>

          {/* Title */}
          <Field label={t.fieldTitle}>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={t.fieldTitlePlaceholder}
              style={INPUT_STYLE}
            />
          </Field>

          {/* Act selector */}
          <Field label={t.fieldAct}>
            <div style={{ display: "flex", gap: 8 }}>
              {ACT_ORDER.map((key) => {
                const conf = ACT_CONFIG[key];
                const active = act === key;
                return (
                  <button key={key} onClick={() => setAct(key)} style={{
                    flex: 1, padding: "8px 0",
                    borderRadius: 8,
                    border: `1px solid ${active ? conf.color : "#e4d5c5"}`,
                    background: active
                      ? `linear-gradient(135deg, ${conf.bg}, ${conf.color}18)`
                      : "transparent",
                    color: active ? conf.accent : "#a09080",
                    fontFamily: "'Crimson Pro', Georgia, serif",
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    letterSpacing: "0.06em",
                    boxShadow: active ? `0 2px 8px ${conf.color}33` : "none",
                  }}>
                    {actLabels[key]}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Beat type */}
          <Field label={t.fieldType}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {BEAT_TYPES.map((bt) => {
                const active = type === bt.id;
                return (
                  <button key={bt.id} onClick={() => setType(bt.id)} style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: `1px solid ${active ? "#b07a5a" : "#e4d5c5"}`,
                    background: active ? "rgba(176,122,90,0.12)" : "transparent",
                    color: active ? "#7a4e2d" : "#a09080",
                    fontFamily: "'Crimson Pro', Georgia, serif",
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span style={{ fontSize: 11 }}>{bt.symbol}</span>
                    {typeLabels[bt.id]}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Notes */}
          <Field label={t.fieldNotes}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.fieldNotesPlaceholder}
              style={{
                ...INPUT_STYLE,
                minHeight: 88, resize: "vertical",
                fontStyle: "italic", lineHeight: 1.65,
              }}
            />
          </Field>

          {/* Tension */}
          <Field label={t.fieldTension(tension)}>
            <input
              type="range" min={1} max={10} step={1} value={tension}
              onChange={(e) => setTension(Number(e.target.value))}
              style={{ width: "100%", "--thumb-color": actConf.accent } as React.CSSProperties}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, gap: 3 }}>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <div key={n} style={{
                  flex: 1, borderRadius: 2,
                  height: n <= tension ? 14 : 5,
                  background: n <= tension
                    ? `linear-gradient(180deg, ${actConf.color}, ${actConf.accent})`
                    : "#e8ddd0",
                  transition: "height 0.18s ease, background 0.18s ease",
                }} />
              ))}
            </div>
          </Field>

          {/* Footer */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <ModalButton onClick={onClose} label={t.btnCancel} />
            <ModalButton
              onClick={handleSave}
              label={isNew ? t.btnAdd : t.btnSave}
              primary disabled={!title.trim()}
              actConf={actConf}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block",
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 10, letterSpacing: "0.22em",
        textTransform: "uppercase", color: "#b0987c", marginBottom: 8,
        fontWeight: 600,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ModalButton({ onClick, label, primary = false, disabled = false, actConf }: {
  onClick: () => void; label: string; primary?: boolean;
  disabled?: boolean; actConf?: ReturnType<typeof getActConfig>;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "9px 22px", borderRadius: 8,
        border: `1px solid ${primary ? (actConf?.color ?? "#b07a5a") : "#e0d4c8"}`,
        background: primary
          ? disabled ? "transparent"
            : hovered
              ? `linear-gradient(135deg, ${actConf?.bg ?? "#f9f0e8"}, ${actConf?.color ?? "#b07a5a"}22)`
              : (actConf?.bg ?? "rgba(176,122,90,0.1)")
          : hovered ? "rgba(0,0,0,0.04)" : "transparent",
        color: primary
          ? disabled ? "#c4b0a0"
          : (actConf?.accent ?? "#7a4e2d")
          : "#a08070",
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 14, fontWeight: primary ? 600 : 400,
        cursor: disabled ? "default" : "pointer",
        letterSpacing: "0.04em",
        transition: "all 0.18s ease",
        opacity: disabled ? 0.55 : 1,
        boxShadow: primary && !disabled && hovered
          ? `0 4px 12px ${actConf?.color ?? "#b07a5a"}44` : "none",
        transform: primary && !disabled && hovered ? "translateY(-1px)" : "none",
      }}
    >
      {label}
    </button>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "#f7f2ea",
  border: "1px solid #e4d5c5",
  borderRadius: 8,
  padding: "10px 13px",
  color: "#241c14",
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  lineHeight: 1.5,
  transition: "border-color 0.18s, background 0.18s",
};

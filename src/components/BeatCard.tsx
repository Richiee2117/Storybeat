import { useState, useRef, useEffect } from "react";
import type { Beat } from "../types";
import type { T } from "../i18n";
import type { DragState } from "../hooks/useDragDrop";
import { getActConfig, getBeatTypeWithT } from "../utils";

interface Props {
  beat: Beat;
  index: number;
  drag: DragState;
  t: T;
  onPointerDown: (e: React.PointerEvent, index: number) => void;
  onRegister: (index: number, el: HTMLElement | null) => void;
  onEdit: (beat: Beat) => void;
  onDelete: (id: string) => void;
}

export function BeatCard({
  beat, index, drag, t,
  onPointerDown, onRegister, onEdit, onDelete,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);

  const act = getActConfig(beat.act);
  const typeInfo = getBeatTypeWithT(beat.type, t);

  const isDragging = drag.dragIndex === index;
  const isOver     = drag.overIndex === index && drag.dragIndex !== null && drag.dragIndex !== index;

  // Register this element so the hook can read its bounding rect
  useEffect(() => {
    onRegister(index, elRef.current);
    return () => onRegister(index, null);
  }, [index, onRegister]);

  function handleDelete() {
    setDeleting(true);
    setTimeout(() => onDelete(beat.id), 350);
  }

  // Shift cards out of the way to open a gap
  // If dragIndex < overIndex: cards between shift left
  // If dragIndex > overIndex: cards between shift right
  let shiftX = 0;
  const { dragIndex, overIndex } = drag;
  if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex && !isDragging) {
    const SHIFT = 16; // px to nudge
    if (dragIndex < overIndex) {
      // dragging right: cards between source and target nudge left
      if (index > dragIndex && index <= overIndex) shiftX = -(SHIFT);
    } else {
      // dragging left: cards between target and source nudge right
      if (index >= overIndex && index < dragIndex) shiftX = SHIFT;
    }
  }

  return (
    <div
      ref={elRef}
      style={{
        position: "relative",
        flexShrink: 0,
        width: 240,
        // Cards being shifted open space for the ghost
        transform: isDragging
          ? "scale(0.96) translateY(6px)"
          : deleting
          ? "scale(0.85) translateY(-14px)"
          : `translateX(${shiftX}px)`,
        opacity: isDragging ? 0 : deleting ? 0 : 1,
        zIndex: 1,
        pointerEvents: deleting ? "none" : isDragging ? "none" : "auto",
        // Smooth transitions for nudge/shift — but not for the dragging card itself
        transition: isDragging
          ? "opacity 0.15s ease, transform 0.15s ease"
          : deleting
          ? "opacity 0.32s ease, transform 0.32s ease"
          : "transform 0.22s cubic-bezier(.22,1,.36,1), opacity 0.22s ease",
        animation: "cardIn 0.45s cubic-bezier(.22,1,.36,1) both",
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseEnter={() => !isDragging && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drop zone indicator — glowing line on the left */}
      <div style={{
        position: "absolute",
        left: -13, top: "8%", bottom: "8%",
        width: 3, borderRadius: 3,
        background: "#b07a5a",
        boxShadow: "0 0 12px rgba(176,122,90,0.7)",
        animation: "breathe 0.6s ease infinite alternate",
        opacity: isOver ? 1 : 0,
        transform: isOver ? "scaleY(1)" : "scaleY(0.4)",
        transition: "opacity 0.15s ease, transform 0.2s cubic-bezier(.22,1,.36,1)",
        transformOrigin: "center",
      }} />

      {/* Card surface */}
      <div
        style={{
          background: hovered && !isDragging ? "#fffefb" : "#fdfaf5",
          border: `1px solid ${
            isOver    ? act.color :
            hovered   ? "#cfc0ac" :
                        "#e4d8ca"
          }`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: hovered
            ? "0 8px 28px rgba(60,35,15,0.12), 0 2px 6px rgba(60,35,15,0.07)"
            : "0 2px 8px rgba(60,35,15,0.07), 0 1px 2px rgba(60,35,15,0.04)",
          transition: "box-shadow 0.25s ease, border-color 0.2s ease, background 0.2s ease",
          userSelect: "none",
        }}
      >
        {/* Top colour bar — also part of the drag handle */}
        <div
          onPointerDown={(e) => onPointerDown(e, index)}
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${act.color}, ${act.accent})`,
            opacity: hovered ? 0.9 : 0.65,
            transition: "opacity 0.25s ease",
            cursor: "grab",
            touchAction: "none",
          }}
        />

        {/* Handle row — the ONLY drag-sensitive zone */}
        <div
          onPointerDown={(e) => onPointerDown(e, index)}
          style={{
            padding: "11px 16px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <span style={{
            fontSize: 10, letterSpacing: "0.16em",
            textTransform: "uppercase", color: act.accent,
            fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600,
            opacity: 0.85,
          }}>
            {typeInfo.symbol}&nbsp;&nbsp;{typeInfo.label}
          </span>
          <span style={{
            display: "flex", gap: 3,
            opacity: hovered ? 0.55 : 0.18,
            transition: "opacity 0.2s",
          }}>
            {[0,1,2,3,4,5].map(i => (
              <span key={i} style={{
                display: "block", width: 3, height: 3,
                borderRadius: "50%", background: "#7a6858",
              }} />
            ))}
          </span>
        </div>

        {/* Body — not draggable, normal cursor */}
        <div style={{ padding: "10px 16px 16px", cursor: "default" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontWeight: 600, lineHeight: 1.25,
            color: "#241c14", marginBottom: 9, letterSpacing: "0.015em",
          }}>
            {beat.title}
          </div>
          <div style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: 13, lineHeight: 1.65,
            color: "#8a7060", fontStyle: "italic", minHeight: 44,
          }}>
            {beat.note || <span style={{ opacity: 0.45 }}>{t.noNotes}</span>}
          </div>

          {/* Tension bar */}
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              flex: 1, height: 4, borderRadius: 4,
              background: "#ede4d8", overflow: "hidden",
            }}>
              <div style={{
                width: `${beat.tension * 10}%`, height: "100%",
                background: `linear-gradient(90deg, ${act.color}aa, ${act.accent})`,
                borderRadius: 4,
                transition: "width 0.5s cubic-bezier(.22,1,.36,1)",
              }} />
            </div>
            <span style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: 10, color: "#b0987c",
              letterSpacing: "0.1em", fontWeight: 600,
              minWidth: 26, textAlign: "right",
            }}>
              {beat.tension}/10
            </span>
          </div>
        </div>

        {/* Hover actions */}
        <div style={{
          display: "flex", gap: 5,
          padding: "0 12px 12px",
          justifyContent: "flex-end",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(5px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}>
          <CardButton onClick={() => onEdit(beat)} label={t.editBtn} />
          <CardButton onClick={handleDelete} label="×" danger />
        </div>
      </div>

      {/* Index badge */}
      <div style={{
        position: "absolute", top: -9, left: 12,
        width: 22, height: 22, borderRadius: "50%",
        background: act.bg, border: `1.5px solid ${act.color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 10, color: act.accent, fontWeight: 600, zIndex: 2,
        boxShadow: "0 1px 4px rgba(60,35,15,0.1)",
        opacity: hovered ? 1 : 0.7,
        transition: "opacity 0.2s, transform 0.2s",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}>
        {index + 1}
      </div>
    </div>
  );
}

// ── Internal ──────────────────────────────────────────────────────────────────

interface CardButtonProps {
  onClick: () => void;
  label: string;
  danger?: boolean;
}

function CardButton({ onClick, label, danger = false }: CardButtonProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "4px 11px", borderRadius: 5,
        border: `1px solid ${danger
          ? hovered ? "#cc7060" : "#e2c4bc"
          : hovered ? "#bfaa98" : "#ddd0c4"}`,
        background: danger
          ? hovered ? "rgba(200,90,70,0.1)" : "transparent"
          : hovered ? "rgba(176,122,90,0.1)" : "transparent",
        color: danger
          ? hovered ? "#9a3828" : "#bc8878"
          : hovered ? "#6e4e30" : "#a08878",
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 11, letterSpacing: "0.07em",
        cursor: "pointer",
        transition: "all 0.15s ease",
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

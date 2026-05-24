import { useEffect, useRef, useState } from "react";
import type { Beat } from "../types";
import type { DragState } from "../hooks/useDragDrop";
import { getActConfig, getBeatTypeWithT } from "../utils";
import type { T } from "../i18n";

interface Props {
  drag: DragState;
  beats: Beat[];
  t: T;
}

/**
 * The floating card that follows the cursor during drag.
 * Rendered at fixed position via a portal-like approach (fixed positioning).
 * Uses a spring-lerp on every animation frame for a satisfying "lag" feel.
 */
export function DragGhost({ drag, beats, t }: Props) {
  const { dragIndex, mouseX, mouseY, originRect } = drag;

  // Smoothed position using requestAnimationFrame lerp
  const [pos, setPos] = useState({ x: mouseX, y: mouseY });
  const posRef = useRef({ x: mouseX, y: mouseY });
  const targetRef = useRef({ x: mouseX, y: mouseY });
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(true);

  // Start lerp loop when ghost mounts
  useEffect(() => {
    mountedRef.current = true;

    function loop() {
      if (!mountedRef.current) return;
      const curr = posRef.current;
      const target = targetRef.current;
      const STIFFNESS = 0.18; // lower = more lag / floaty
      const nx = curr.x + (target.x - curr.x) * STIFFNESS;
      const ny = curr.y + (target.y - curr.y) * STIFFNESS;
      const changed = Math.abs(nx - curr.x) > 0.05 || Math.abs(ny - curr.y) > 0.05;
      if (changed) {
        posRef.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Update target whenever mouse moves
  useEffect(() => {
    targetRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  if (dragIndex === null) return null;
  const beat = beats[dragIndex];
  if (!beat) return null;

  const act = getActConfig(beat.act);
  const typeInfo = getBeatTypeWithT(beat.type, t);

  // Offset so card appears grabbed from where you clicked, not corner
  const W = originRect?.width ?? 240;
  const H = originRect?.height ?? 200;
  const offsetX = originRect ? (mouseX - originRect.left) : W / 2;
  const offsetY = originRect ? (mouseY - originRect.top)  : 30;

  // Tilt based on horizontal velocity
  const dx = mouseX - drag.startX;
  const tilt = Math.max(-8, Math.min(8, dx * 0.02));

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: W,
      pointerEvents: "none",
      zIndex: 9999,
      transform: `translate(${pos.x - offsetX}px, ${pos.y - offsetY}px) rotate(${tilt}deg) scale(1.04)`,
      willChange: "transform",
      filter: "drop-shadow(0 24px 40px rgba(40,20,5,0.28)) drop-shadow(0 4px 10px rgba(40,20,5,0.18))",
    }}>
      <div style={{
        background: "#fffefb",
        border: `1.5px solid ${act.color}`,
        borderRadius: 12,
        overflow: "hidden",
        opacity: 0.96,
      }}>
        {/* Accent bar */}
        <div style={{
          height: 5,
          background: `linear-gradient(90deg, ${act.color}, ${act.accent})`,
        }} />

        {/* Type label */}
        <div style={{
          padding: "11px 16px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontSize: 10, letterSpacing: "0.16em",
            textTransform: "uppercase", color: act.accent,
            fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600,
          }}>
            {typeInfo.symbol}&nbsp;&nbsp;{typeInfo.label}
          </span>
          {/* Drag grip dots */}
          <span style={{ display: "flex", gap: 3, opacity: 0.5 }}>
            {[0,1,2,3,4,5].map(i => (
              <span key={i} style={{
                display: "block", width: 3, height: 3,
                borderRadius: "50%", background: "#7a6858",
              }} />
            ))}
          </span>
        </div>

        {/* Title + note */}
        <div style={{ padding: "10px 16px 14px" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontWeight: 600,
            color: "#241c14", marginBottom: 7,
            lineHeight: 1.25, letterSpacing: "0.015em",
          }}>
            {beat.title}
          </div>
          {beat.note && (
            <div style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: 12.5, lineHeight: 1.6,
              color: "#8a7060", fontStyle: "italic",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {beat.note}
            </div>
          )}

          {/* Tension bar */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 4, background: "#ede4d8", overflow: "hidden" }}>
              <div style={{
                width: `${beat.tension * 10}%`, height: "100%",
                background: `linear-gradient(90deg, ${act.color}aa, ${act.accent})`,
                borderRadius: 4,
              }} />
            </div>
            <span style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: 10, color: "#b0987c",
              letterSpacing: "0.1em", fontWeight: 600,
            }}>{beat.tension}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

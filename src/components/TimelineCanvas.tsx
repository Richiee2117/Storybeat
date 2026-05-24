import { useRef, useCallback } from "react";
import type { Beat, FilterId } from "../types";
import { ACT_ORDER } from "../data";
import type { T } from "../i18n";
import { ActLabel } from "./ActLabel";
import { BeatCard } from "./BeatCard";
import { DragGhost } from "./DragGhost";
import { useDragDrop } from "../hooks/useDragDrop";

interface Props {
  beats: Beat[];
  activeFilter: FilterId;
  t: T;
  onEdit: (beat: Beat) => void;
  onDelete: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export function TimelineCanvas({ beats, activeFilter, t, onEdit, onDelete, onReorder }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { drag, registerCard, startDrag } = useDragDrop({ onReorder });

  // Stable callback wrappers to prevent re-registering on every render
  const handleRegister = useCallback(
    (index: number, el: HTMLElement | null) => registerCard(index, el),
    [registerCard]
  );
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, index: number) => startDrag(e, index),
    [startDrag]
  );

  const visibleBeats =
    activeFilter === "all" ? beats : beats.filter((b) => b.act === activeFilter);
  const acts =
    activeFilter === "all"
      ? ACT_ORDER
      : [activeFilter as (typeof ACT_ORDER)[number]];

  const isDraggingAny = drag.dragIndex !== null;

  return (
    <>
      <div style={{
        flex: 1,
        overflow: "hidden",
        position: "relative",
        background: `
          radial-gradient(ellipse 70% 60% at 30% 40%, rgba(200,165,120,0.07) 0%, transparent 65%),
          radial-gradient(ellipse 60% 50% at 80% 70%, rgba(140,170,150,0.05) 0%, transparent 60%),
          repeating-linear-gradient(
            0deg, transparent, transparent 47px,
            rgba(190,155,110,0.06) 47px, rgba(190,155,110,0.06) 48px
          ),
          #ede6d8
        `,
        // When dragging, dim the background slightly to make ghost pop
        transition: "filter 0.2s ease",
        filter: isDraggingAny ? "brightness(0.97)" : "brightness(1)",
      }}>
        {/* Scroll rail */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            padding: "44px 56px 44px",
            overflowX: "auto",
            overflowY: "hidden",
            height: "100%",
            scrollbarWidth: "thin",
            // Prevent text selection during drag
            userSelect: isDraggingAny ? "none" : "auto",
          }}
        >
          {acts.map((actId) => {
            const actBeats = visibleBeats.filter((b) => b.act === actId);
            if (!actBeats.length) return null;

            return (
              <div key={actId} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0,
                flexShrink: 0,
              }}>
                <ActLabel actId={actId} t={t} />

                <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  {actBeats.map((beat) => {
                    const globalIndex = beats.indexOf(beat);
                    return (
                      <BeatCard
                        key={beat.id}
                        beat={beat}
                        index={globalIndex}
                        drag={drag}
                        t={t}
                        onPointerDown={handlePointerDown}
                        onRegister={handleRegister}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    );
                  })}
                </div>

                {/* Act divider */}
                {activeFilter === "all" && (
                  <div style={{
                    marginLeft: 18, marginRight: 18,
                    alignSelf: "stretch",
                    display: "flex", alignItems: "center",
                  }}>
                    <div style={{
                      width: 1, height: "40%",
                      background: "linear-gradient(180deg, transparent, #c8b89a, transparent)",
                      opacity: 0.5,
                    }} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {visibleBeats.length === 0 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              flex: 1, flexDirection: "column", gap: 14,
              opacity: 0.45, paddingTop: 60,
            }}>
              <div style={{
                fontFamily: "'IM Fell English SC', Georgia, serif",
                fontSize: 52, color: "#a89070",
              }}>
                {t.emptyTitle}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18, color: "#8a7060", fontStyle: "italic",
              }}>
                {t.emptyMessage}
              </div>
            </div>
          )}
        </div>

        {/* Edge fades */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 56,
          background: "linear-gradient(90deg, #ede6d8ee, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
          background: "linear-gradient(270deg, #ede6d8ee, transparent)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Floating ghost — rendered outside the scroll container so it's never clipped */}
      <DragGhost drag={drag} beats={beats} t={t} />
    </>
  );
}

import type { Beat } from "../types";
import { ACT_CONFIG, ACT_ORDER } from "../data";
import type { T } from "../i18n";

interface Props {
  beats: Beat[];
  t: T;
}

export function AppFooter({ beats, t }: Props) {
  const actLabels: Record<string, string> = {
    setup: t.actSetup,
    confrontation: t.actConfrontation,
    resolution: t.actResolution,
  };

  return (
    <footer style={{
      background: "linear-gradient(0deg, #fdfaf4 0%, #fffefb 100%)",
      borderTop: "1px solid #e0d4c4",
      padding: "10px 36px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: 11,
        color: "#c0a898",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        {t.beatsCount(beats.length)}
      </span>

      <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
        {ACT_ORDER.map((k) => {
          const v = ACT_CONFIG[k];
          const count = beats.filter(b => b.act === k).length;
          return (
            <span key={k} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: 11, color: v.accent,
              letterSpacing: "0.07em",
              opacity: count > 0 ? 1 : 0.4,
            }}>
              <div style={{
                width: 20, height: 3, borderRadius: 2,
                background: `linear-gradient(90deg, ${v.color}, ${v.accent})`,
              }} />
              {actLabels[k]}
              <span style={{ color: "#c0a898", fontSize: 10 }}>({count})</span>
            </span>
          );
        })}
      </div>
    </footer>
  );
}

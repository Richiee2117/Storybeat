import { getActConfig } from "../utils";
import type { ActId } from "../types";
import type { T } from "../i18n";

interface Props {
  actId: ActId;
  t: T;
}

export function ActLabel({ actId, t }: Props) {
  const conf = getActConfig(actId);
  const labels: Record<ActId, string> = {
    setup: t.actSetup,
    confrontation: t.actConfrontation,
    resolution: t.actResolution,
  };

  return (
    <div style={{
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: 0,
      paddingRight: 10,
      opacity: 0.6,
    }}>
      <div style={{
        writingMode: "vertical-lr",
        transform: "rotate(180deg)",
        fontFamily: "'IM Fell English SC', Georgia, serif",
        fontSize: 10,
        letterSpacing: "0.22em",
        color: conf.accent,
        whiteSpace: "nowrap",
        padding: "10px 0",
        userSelect: "none",
      }}>
        {labels[actId]}
      </div>
      <div style={{
        width: 1,
        background: `linear-gradient(180deg, transparent, ${conf.color}, transparent)`,
        alignSelf: "stretch",
        marginLeft: 7,
        opacity: 0.5,
      }} />
    </div>
  );
}

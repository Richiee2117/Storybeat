import type { Beat } from "../types";

interface Props {
  beats: Beat[];
}

export function TensionArc({ beats }: Props) {
  if (!beats.length) return null;

  const W = 280, H = 44, pad = 10;

  const pts = beats.map((b, i) => {
    const x = pad + (i / Math.max(beats.length - 1, 1)) * (W - pad * 2);
    const y = H - pad - (b.tension / 10) * (H - pad * 2);
    return [x, y] as [number, number];
  });

  // Smooth bezier curve through points
  function smoothPath(points: [number, number][]) {
    if (points.length < 2) return points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev[0] + curr[0]) / 2;
      d += ` C${cpx},${prev[1]} ${cpx},${curr[1]} ${curr[0]},${curr[1]}`;
    }
    return d;
  }

  const linePath = smoothPath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  const areaPath = linePath + ` L${last[0]},${H} L${first[0]},${H} Z`;

  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <defs>
        <linearGradient id="arcfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b07a5a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#b07a5a" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="arcstroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8a882" />
          <stop offset="100%" stopColor="#8a5030" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#arcfill)" />
      <path d={linePath} fill="none" stroke="url(#arcstroke)" strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.8" fill="url(#arcstroke)" opacity="0.75" />
      ))}
    </svg>
  );
}

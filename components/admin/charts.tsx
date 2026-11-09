"use client";

import { useId } from "react";

/** Area chart with a hover-free, always-readable value row beneath. */
export function AreaChart({ data, height = 180, format }: { data: { label: string; value: number }[]; height?: number; format: (n: number) => string }) {
  const id = useId();
  const w = 600;
  const pad = 8;
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0;
  const pts = data.map((d, i) => [pad + i * step, height - pad - (d.value / max) * (height - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${height - pad} L${pad} ${height - pad} Z`;
  const every = Math.ceil(data.length / 7);
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img" aria-label={data.map((d) => `${d.label}: ${format(d.value)}`).join(", ")} preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1a1a1a" stopOpacity="0.18" />
            <stop offset="1" stopColor="#1a1a1a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={pad} x2={w - pad} y1={height - pad - g * (height - pad * 2)} y2={height - pad - g * (height - pad * 2)} stroke="#ececec" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke="#1a1a1a" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#1a1a1a" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-[#616161]">
        {data.map((d, i) => (i % every === 0 ? <span key={d.label + i}>{d.label}</span> : <span key={d.label + i} />))}
      </div>
    </div>
  );
}

export function Bar({ value, max, tone = "#1a1a1a" }: { value: number; max: number; tone?: string }) {
  return (
    <div className="h-2 rounded-full bg-[#ececec]">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))}%`, background: tone }} />
    </div>
  );
}

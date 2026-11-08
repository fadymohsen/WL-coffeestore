"use client";

/** Simple line-art illustrations (flat, single colour) for the 9 cards. */
export default function CardArt({ kind, color }: { kind: string; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const cup = (x: number, y: number) => (
    <g {...p}>
      <path d={`M${x} ${y}h44v6a22 22 0 0 1-44 0z`} />
      <path d={`M${x + 44} ${y + 4}a8 8 0 0 1 0 16`} />
      <path d={`M${x - 6} ${y + 36}h56`} />
    </g>
  );
  const steam = (x: number, y: number) => (
    <g {...p}>
      <path d={`M${x} ${y}c-6-8 6-12 0-20`} />
      <path d={`M${x + 12} ${y}c-6-8 6-12 0-20`} />
    </g>
  );
  let art: React.ReactNode;
  switch (kind) {
    case "clink":
      art = <>{cup(14, 70)}{cup(70, 70)}{steam(34, 62)}{steam(90, 62)}</>;
      break;
    case "cezve":
      art = (
        <g {...p}>
          <path d="M20 40l30-8 12 30h-34z" />
          <path d="M62 62c10 0 20 4 20 14" />
          <path d="M82 90v14M70 104h24" />
          <path d="M44 100a20 20 0 0 1 40 0" />
          <path d="M92 74c16 6 24 14 24 24" />
        </g>
      );
      break;
    case "bistro":
      art = <>{cup(40, 60)}{steam(58, 54)}<g {...p}><path d="M20 112h90M65 102v40M45 142h40M118 70v70M118 70h12" /></g></>;
      break;
    case "portafilter":
      art = (
        <g {...p}>
          <circle cx="60" cy="50" r="22" />
          <path d="M60 72v14M52 86h16M30 50h-22" />
          <path d="M45 100h30v20a15 15 0 0 1-30 0z" />
          <path d="M60 86v8" strokeDasharray="2 4" />
        </g>
      );
      break;
    case "steam":
      art = (
        <>
          {cup(42, 80)}
          <g fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round"><path d="M56 70c-8-10 8-16 0-28" /></g>
          <g fill="none" stroke="#A8432C" strokeWidth={2.2} strokeLinecap="round"><path d="M76 70c-8-10 8-16 0-28" /></g>
        </>
      );
      break;
    case "lantern":
      art = (
        <g {...p}>
          <path d="M30 40h30M45 30v10M32 44h26l6 8v36l-6 8H32l-6-8V52z" />
          <path d="M45 52v44M32 70h26" />
          <path d="M20 128h50" />
          <path d="M84 100h34v6a17 17 0 0 1-34 0z" />
        </g>
      );
      break;
    case "milk":
      art = (
        <g {...p}>
          <path d="M20 40h28l8 14v36H28z" />
          <path d="M56 56c22 6 30 18 30 32" />
          <path d="M72 92h40v6a20 20 0 0 1-40 0z" />
          <path d="M82 120c10 4 20 4 30 0" />
        </g>
      );
      break;
    case "hazelnut":
      art = (
        <>
          {cup(36, 90)}
          <g {...p}>
            <ellipse cx="30" cy="54" rx="12" ry="15" />
            <ellipse cx="62" cy="48" rx="12" ry="15" />
            <path d="M24 42c6-6 12-6 12-6M56 36c6-6 12-6 12-6" />
            <path d="M90 60c14-10 20-4 22 6-10 4-20 2-22-6z" />
          </g>
        </>
      );
      break;
    case "cacao":
      art = (
        <>
          {cup(30, 96)}
          <g {...p}>
            <path d="M52 20c22 6 36 28 30 56-24-2-40-24-30-56z" />
            <path d="M54 30c14 8 20 20 22 36M62 26c8 10 12 20 12 34" />
            <path d="M92 44c10-8 22-4 24 6-10 6-22 4-24-6z" />
          </g>
        </>
      );
      break;
    default:
      art = cup(40, 70);
  }
  return (
    <svg viewBox="0 0 130 150" className="h-full w-full" aria-hidden="true">
      {art}
    </svg>
  );
}


"use client";

import { useId } from "react";
import { useConfirmStore } from "@/lib/confirm";
import { useTrap } from "@/lib/useTrap";

function Panel() {
  const req = useConfirmStore((s) => s.req)!;
  const settle = useConfirmStore((s) => s.settle);
  const ref = useTrap(() => settle(false));
  const id = useId();
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 p-4" onClick={() => settle(false)}>
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        aria-describedby={req.body ? `${id}-b` : undefined}
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#303030] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={`${id}-t`} className="text-lg font-semibold text-[#1a1a1a]">{req.title}</h2>
        {req.body && <p id={`${id}-b`} className="mt-2 text-sm leading-relaxed text-[#616161]">{req.body}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => settle(false)} className="rounded-lg border border-[#c9c9c9] px-4 py-2 text-sm font-semibold transition hover:bg-[#fafafa] active:scale-[0.98]">{req.cancelLabel}</button>
          <button onClick={() => settle(true)} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98] ${req.danger ? "bg-[#a8322f] hover:bg-[#8e0b21]" : "bg-[#1a1a1a] hover:bg-[#303030]"}`}>{req.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmHost() {
  const open = useConfirmStore((s) => !!s.req);
  return open ? <Panel /> : null;
}

"use client";

import { create } from "zustand";

export interface ToastAction {
  label: string;
  run: () => void;
}

interface Toast {
  id: number;
  text: string;
  tone: "ok" | "error";
  action?: ToastAction;
}

interface ToastState {
  toasts: Toast[];
  push: (text: string, tone?: Toast["tone"], action?: ToastAction) => void;
  dismiss: (id: number) => void;
}

let n = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (text, tone = "ok", action) => {
    const id = ++n;
    set((s) => ({ toasts: [...s.toasts, { id, text, tone, action }] }));
    window.setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), action ? 6500 : 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

"use client";

import { create } from "zustand";

export interface ConfirmRequest {
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
}

interface ConfirmState {
  req: (ConfirmRequest & { resolve: (ok: boolean) => void }) | null;
  ask: (r: ConfirmRequest) => Promise<boolean>;
  settle: (ok: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  req: null,
  ask: (r) => new Promise<boolean>((resolve) => set({ req: { ...r, resolve } })),
  settle: (ok) => {
    get().req?.resolve(ok);
    set({ req: null });
  },
}));

/** Ask the user to confirm an action in an accessible dialog. Resolves true when they confirm. */
export const askConfirm = (r: ConfirmRequest) => useConfirmStore.getState().ask(r);

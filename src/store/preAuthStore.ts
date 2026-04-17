import { create } from 'zustand';

export interface PreAuthHold {
  id: string;
  amount: number;
  cardLast4: string;
  authCode: string;
  createdAt: string;
}

interface PreAuthState {
  activeHold: PreAuthHold | null;
  setHold: (hold: PreAuthHold) => void;
  voidHold: () => void;
  clearHold: () => void;
}

export const usePreAuthStore = create<PreAuthState>((set) => ({
  activeHold: null,
  setHold: (hold) => set({ activeHold: hold }),
  voidHold: () => set({ activeHold: null }),
  clearHold: () => set({ activeHold: null }),
}));

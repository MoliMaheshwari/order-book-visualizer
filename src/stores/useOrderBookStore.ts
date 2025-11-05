// src/stores/useOrderBookStore.ts
import { create } from "zustand";

interface Trade {
  id: string;
  price: number;
  qty: number;
  isBuyerMaker: boolean;
  timestamp: number;
}

interface OrderBookState {
  bids: [number, number][];
  asks: [number, number][];
  trades: Trade[];
  applyDelta: (side: "bids" | "asks", updates: [number, number][]) => void;
  addTrade: (trade: Trade) => void;
  reset: () => void;
}

export const useOrderBookStore = create<OrderBookState>((set) => ({
  bids: [],
  asks: [],
  trades: [],

  applyDelta: (side, updates) =>
    set((state) => {
      // Convert current array into Map for efficient merging
      const map = new Map(state[side]);
      for (const [price, qty] of updates) {
        if (qty === 0) map.delete(price);
        else map.set(price, qty);
      }
      // Convert back to sorted array for rendering
      const sorted = Array.from(map.entries()).sort((a, b) =>
        side === "bids" ? b[0] - a[0] : a[0] - b[0]
      );
      return { ...state, [side]: sorted };
    }),

  addTrade: (trade) =>
    set((state) => ({
      trades: [trade, ...state.trades].slice(0, 50),
    })),

  reset: () => set({ bids: [], asks: [], trades: [] }),
}));

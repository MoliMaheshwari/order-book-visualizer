// src/hooks/useBinanceHttpPoll.ts
// HTTP polling fallback for networks that block WebSockets or direct Binance API.

import { useEffect } from "react";
import { useOrderBookStore } from "../stores/useOrderBookStore";

const BOOK_URL =
  "https://api.allorigins.win/raw?url=https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=100";
const TRADES_URL =
  "https://api.allorigins.win/raw?url=https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=50";

export function useBinanceHttpPoll(intervalMs = 2000) {
  const { applyDelta, addTrade, reset } = useOrderBookStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const [bookRes, tradesRes] = await Promise.all([
          fetch(BOOK_URL),
          fetch(TRADES_URL),
        ]);

        if (!bookRes.ok || !tradesRes.ok) throw new Error("API fetch failed");

        const book = await bookRes.json();
        const trades = await tradesRes.json();

        // Defensive checks to avoid crashes
        if (!book?.bids || !book?.asks) throw new Error("Invalid book structure");
        if (!Array.isArray(trades)) throw new Error("Invalid trades structure");

        // Apply live data
        applyDelta(
          "bids",
          book.bids.map((b: [string, string]) => [+b[0], +b[1]])
        );
        applyDelta(
          "asks",
          book.asks.map((a: [string, string]) => [+a[0], +a[1]])
        );

        trades.forEach((t: any) =>
          addTrade({
            id: t.id?.toString() ?? Math.random().toString(),
            price: +t.price,
            qty: +t.qty,
            isBuyerMaker: t.isBuyerMaker,
            timestamp: t.time ?? Date.now(),
          })
        );
      } catch (err) {
        console.warn("⚠️ HTTP poll error:", err);

        // Mock fallback (for offline/local testing)
        applyDelta("bids", [
          [70200.5, 0.12],
          [70199.8, 0.35],
        ]);
        applyDelta("asks", [
          [70201.2, 0.22],
          [70202.0, 0.15],
        ]);
        addTrade({
          id: "mock-" + Date.now(),
          price: 70200.5,
          qty: 0.01,
          isBuyerMaker: Math.random() > 0.5,
          timestamp: Date.now(),
        });
      }

      timer = setTimeout(fetchData, intervalMs);
    };

    fetchData();

    return () => clearTimeout(timer);
  }, [applyDelta, addTrade, reset, intervalMs]);
}

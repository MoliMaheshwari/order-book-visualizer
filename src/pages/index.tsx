import { useEffect, useState } from "react";
import { useOrderBookStore } from "../stores/useOrderBookStore";
import { OrderBook } from "../components/OrderBook";
import { RecentTrades } from "../components/RecentTrades";
import { useBinanceHttpPoll } from "../hooks/useBinanceHttpPoll";
import { useBinanceSocket } from "../hooks/useBinanceSocket";

export default function HomePage() {
  const { bids, asks, trades } = useOrderBookStore();
  const [connected, setConnected] = useState(false);
  const [socketFailed, setSocketFailed] = useState(false);

  // 🟢 Try WebSocket first — call hook directly (not inside useEffect)
  let wsError = false;
  try {
    useBinanceSocket("btcusdt");
  } catch {
    wsError = true;
    setSocketFailed(true);
  }

  // 🔁 If WebSocket is blocked, fallback to HTTP polling
  if (socketFailed || wsError) {
    useBinanceHttpPoll(2000);
  }

  // Connection indicator
  useEffect(() => {
    if (bids.length > 0 && asks.length > 0) setConnected(true);
    else setConnected(false);
  }, [bids, asks]);

  const spread =
    bids.length > 0 && asks.length > 0
      ? (asks[0][0] - bids[0][0]).toFixed(2)
      : "—";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Real-Time Order Book Visualizer</h1>
        <div
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
            connected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </header>

      <p className="text-sm text-gray-400 mb-4">
        {socketFailed
          ? "⚠️ WebSocket blocked — switched to HTTP polling (updates every 2s)"
          : "✅ Connected via WebSocket (real-time updates)"}
      </p>

      <main className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <OrderBook bids={bids} asks={asks} />
        </div>
        <div className="col-span-1">
          <RecentTrades trades={trades} />
        </div>
      </main>

      <footer className="mt-6 text-gray-400 text-sm flex justify-center">
        <div className="bg-gray-900/50 px-4 py-2 rounded-lg">
          Spread: <span className="text-white font-semibold ml-1">{spread}</span>
        </div>
      </footer>
    </div>
  );
}

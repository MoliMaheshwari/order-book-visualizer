// src/hooks/useBinanceSocket.ts
import { useEffect } from "react";
import { useOrderBookStore } from "../stores/useOrderBookStore";

export function useBinanceSocket(symbol = "btcusdt") {
  const { applyDelta, addTrade, reset } = useOrderBookStore();

  useEffect(() => {
    let depthSocket: WebSocket | null = null;
    let tradeSocket: WebSocket | null = null;

    try {
      depthSocket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}@depth@100ms`
      );
      tradeSocket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}@aggTrade`
      );

      depthSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        applyDelta(
          "bids",
          data.b?.map((b: [string, string]) => [+b[0], +b[1]]) || []
        );
        applyDelta(
          "asks",
          data.a?.map((a: [string, string]) => [+a[0], +a[1]]) || []
        );
      };

      tradeSocket.onmessage = (event) => {
        const trade = JSON.parse(event.data);
        addTrade({
          id: trade.a.toString(),
          price: +trade.p,
          qty: +trade.q,
          isBuyerMaker: trade.m,
          timestamp: trade.T,
        });
      };
    } catch (err) {
      console.error("WebSocket error:", err);
      reset();
    }

    return () => {
      depthSocket?.close();
      tradeSocket?.close();
    };
  }, [symbol, applyDelta, addTrade, reset]);
}

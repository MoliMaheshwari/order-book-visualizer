import React from "react";

interface OrderBookProps {
  bids: [number, number][];
  asks: [number, number][];
}

export const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {
  const maxTotalBid = bids.reduce((acc, [, qty]) => acc + qty, 0);
  const maxTotalAsk = asks.reduce((acc, [, qty]) => acc + qty, 0);

  // Calculate cumulative totals for depth visualization
  const cumulative = (orders: [number, number][]) => {
    let total = 0;
    return orders.map(([price, qty]) => {
      total += qty;
      return [price, qty, total];
    });
  };

  const cumBids = cumulative(bids);
  const cumAsks = cumulative(asks);

  return (
    <div className="bg-gray-900/60 p-4 rounded-2xl shadow-lg h-[600px] overflow-y-auto border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Order Book (BTC/USDT)
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* ------- BIDS (BUY ORDERS) ------- */}
        <div>
          <h3 className="text-green-400 mb-2 text-sm font-semibold">Bids</h3>
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="text-gray-400">
                <th align="left">Price (USDT)</th>
                <th align="right">Amount (BTC)</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {cumBids.slice(0, 20).map(([price, qty, total]) => (
                <tr key={price} className="relative">
                  <td className="text-green-400">{price.toFixed(2)}</td>
                  <td align="right">{qty.toFixed(4)}</td>
                  <td align="right">{total.toFixed(4)}</td>
                  <td
                    className="absolute left-0 top-0 h-full bg-green-500/10 -z-10"
                    style={{
                      width: `${(total / maxTotalBid) * 100}%`,
                    }}
                  ></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ------- ASKS (SELL ORDERS) ------- */}
        <div>
          <h3 className="text-red-400 mb-2 text-sm font-semibold">Asks</h3>
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="text-gray-400">
                <th align="left">Price (USDT)</th>
                <th align="right">Amount (BTC)</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {cumAsks.slice(0, 20).map(([price, qty, total]) => (
                <tr key={price} className="relative">
                  <td className="text-red-400">{price.toFixed(2)}</td>
                  <td align="right">{qty.toFixed(4)}</td>
                  <td align="right">{total.toFixed(4)}</td>
                  <td
                    className="absolute left-0 top-0 h-full bg-red-500/10 -z-10"
                    style={{
                      width: `${(total / maxTotalAsk) * 100}%`,
                    }}
                  ></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from "react";

interface Trade {
  id: string;
  price: number;
  qty: number;
  isBuyerMaker: boolean;
  timestamp: number;
}

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
  return (
    <div className="bg-gray-900/60 p-4 rounded-2xl shadow-lg h-[600px] overflow-y-auto border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-center text-yellow-400">
        Recent Trades
      </h2>

      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-gray-400">
            <th align="left">Price (USDT)</th>
            <th align="right">Amount (BTC)</th>
            <th align="right">Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.slice(0, 50).map((trade) => (
            <tr
              key={trade.id}
              className={`${
                trade.isBuyerMaker
                  ? "text-red-400 bg-red-500/5"
                  : "text-green-400 bg-green-500/5"
              } hover:bg-gray-800 transition`}
            >
              <td>{trade.price.toFixed(2)}</td>
              <td align="right">{trade.qty.toFixed(4)}</td>
              <td align="right">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

# Real-Time Order Book Visualizer

🔗 **Live Demo:** [https://order-book-visualizer-gilt.vercel.app/](https://order-book-visualizer-gilt.vercel.app/)

A high-performance, real-time stock order book visualizer built using **Next.js**, **TypeScript**, and **Zustand**.  
It connects to the **Binance WebSocket API** to stream live BTC/USDT market data and displays an interactive, responsive order book with recent trades.


---

## 🚀 Objective
Build a real-time trading order book visualizer that handles live, high-frequency data efficiently and maintains a smooth UI.

---

## 🧩 Tech Stack
- **Next.js** (React + TypeScript)
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Binance WebSocket API** for live market data
- **HTTP polling fallback** for restricted networks

---

## ⚙️ Features
### 📈 Order Book
- Live **bids (green)** and **asks (red)** columns  
- Sorted correctly (bids → descending, asks → ascending)  
- **Cumulative totals** per side  
- **Depth visualization** via background bars  
- **Spread** displayed between best bid and ask  

### 💹 Recent Trades
- Shows the **50 most recent trades**
- Trades update in real time
- **Color-coded flash**: green for buy, red for sell  

### ⚡ Performance
- Efficient incremental updates using Maps
- Minimal re-renders through React memoization
- Graceful fallback when WebSocket is unavailable

---

## 🧠 How It Works
1. **WebSocket Feed:** Connects to Binance’s `btcusdt@depth` and `btcusdt@trade` streams for live deltas and trades.  
2. **State Aggregation:** Deltas are merged into a single in-memory order book using O(1) updates.  
3. **UI Rendering:** The book and trades render efficiently, with spread and cumulative totals updated dynamically.  
4. **Fallback:** If WebSocket fails (e.g., restricted region), HTTP polling fetches the latest data every 2 seconds.

---

## 🛠️ Getting Started

### 1️⃣ Install dependencies
```bash
npm install

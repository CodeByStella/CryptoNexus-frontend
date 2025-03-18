import { CryptoPrice } from "@/types/types";

export const cryptoPrices: CryptoPrice[] = [
  { ticker: "BTC", value: 88509.1234, changeRate: 2.62, changeDirection: "High" },
  { ticker: "ETH", value: 3001.5678, changeRate: 1.96, changeDirection: "Low" },
  { ticker: "BNB", value: 412.9876, changeRate: 0.85, changeDirection: "High" },
  { ticker: "SOL", value: 128.6543, changeRate: 3.21, changeDirection: "High" },
  { ticker: "XRP", value: 0.6453, changeRate: 1.12, changeDirection: "Low" },
  { ticker: "ADA", value: 0.4587, changeRate: 2.78, changeDirection: "High" },
  { ticker: "DOGE", value: 0.0891, changeRate: 0.63, changeDirection: "Low" },
  { ticker: "AVAX", value: 38.2345, changeRate: 2.49, changeDirection: "High" },
  { ticker: "MATIC", value: 1.2678, changeRate: 1.57, changeDirection: "Low" },
  { ticker: "DOT", value: 6.8934, changeRate: 3.02, changeDirection: "High" },
];


export const transactionOrders: {
  time: string;
  exchange: string,
  ticker: string,
  status: "Close" | "Cancel" | "Open";
  price: number;
  Quantity: number;
}[] = [
    { time: "2025-03-10 10:12:14", exchange: "Binance", ticker: "BNB", status: "Close", price: 312.45, Quantity: 1.5 },
    { time: "2025-03-10 10:15:20", exchange: "Coinbase", ticker: "ETH", status: "Open", price: 2875.99, Quantity: 0.8 },
    { time: "2025-03-10 10:18:05", exchange: "Kraken", ticker: "BTC", status: "Cancel", price: 65432.10, Quantity: 0.25 },
    { time: "2025-03-10 10:22:30", exchange: "Binance", ticker: "ADA", status: "Close", price: 1.23, Quantity: 150 },
    { time: "2025-03-10 10:30:45", exchange: "Bitfinex", ticker: "SOL", status: "Open", price: 142.77, Quantity: 3.2 },
    { time: "2025-03-10 10:33:10", exchange: "Binance", ticker: "BNB", status: "Close", price: 310.12, Quantity: 2 },
    { time: "2025-03-10 10:35:55", exchange: "Kraken", ticker: "DOT", status: "Cancel", price: 8.65, Quantity: 25 },
    { time: "2025-03-10 10:40:20", exchange: "Coinbase", ticker: "ETH", status: "Open", price: 2890.12, Quantity: 1.1 },
    { time: "2025-03-10 10:45:10", exchange: "Binance", ticker: "BTC", status: "Close", price: 65200.99, Quantity: 0.3 },
    { time: "2025-03-10 10:50:30", exchange: "KuCoin", ticker: "MATIC", status: "Open", price: 1.09, Quantity: 120 },
    { time: "2025-03-10 10:55:15", exchange: "Bitfinex", ticker: "SOL", status: "Cancel", price: 140.32, Quantity: 2.7 },
    { time: "2025-03-10 11:00:25", exchange: "Binance", ticker: "BNB", status: "Close", price: 315.78, Quantity: 1.3 },
    { time: "2025-03-10 11:05:50", exchange: "Coinbase", ticker: "BTC", status: "Open", price: 65500.45, Quantity: 0.4 },
    { time: "2025-03-10 11:10:35", exchange: "Kraken", ticker: "ETH", status: "Cancel", price: 2860.88, Quantity: 0.6 },
    { time: "2025-03-10 11:15:10", exchange: "KuCoin", ticker: "MATIC", status: "Close", price: 1.11, Quantity: 90 },
    { time: "2025-03-10 11:20:00", exchange: "Bitfinex", ticker: "SOL", status: "Open", price: 145.92, Quantity: 4.1 },
    { time: "2025-03-10 11:25:45", exchange: "Binance", ticker: "BNB", status: "Cancel", price: 317.89, Quantity: 2.2 },
    { time: "2025-03-10 11:30:20", exchange: "Kraken", ticker: "DOT", status: "Close", price: 9.12, Quantity: 18 },
    { time: "2025-03-10 11:35:55", exchange: "Coinbase", ticker: "ETH", status: "Open", price: 2900.65, Quantity: 1.5 },
    { time: "2025-03-10 11:40:30", exchange: "Binance", ticker: "BTC", status: "Cancel", price: 65000.99, Quantity: 0.35 }
  ];
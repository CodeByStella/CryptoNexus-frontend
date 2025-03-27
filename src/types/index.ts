export type MarketTicker = {
    c: number;
    o: number;
    h: number;
    l: number;
    v: number;
    m: string;
    bv: number;
    ch: number;
    icon: string;
    lineChart: string;
    channel: string;
    scode: string;
    T: number;
    t: number;
  };
  
  // types.ts
// types.ts
export type Trade = {
  profitAmount: number;
  principalAmount: number;
  id: string;
  user?: string; // Make user optional since the backend can set it from the token
  tradeType: "buy" | "sell";
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  expectedPrice: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  createdAt: string;
  updatedAt?: string; // Make updatedAt optional since the backend can set it
  tradeMode: "Swap" | "Spot" | "Seconds";
  profit?: number;
};
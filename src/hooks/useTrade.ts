import { useState, useEffect } from "react";
import { Trade } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  const fetchTrades = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authorization token found in localStorage");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user/trades`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data.trades)) {
        setTrades(data.trades);
      } else {
        console.error("Invalid trade data format:", data);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const submitTrade = async (
    tradeData: Omit<Trade, "id" | "status" | "createdAt">, // tradeData must include tradeMode
    setAmount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authorization token found in localStorage");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user/trade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tradeData),
      });

      if (response.ok) {
        await fetchTrades();
        setAmount(0);
      } else {
        console.error("Failed to submit trade:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting trade:", error);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  return { trades, fetchTrades, submitTrade };
};
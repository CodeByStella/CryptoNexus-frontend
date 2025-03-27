import { useState, useEffect, useCallback } from "react";
import { Trade } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  const fetchTrades = useCallback(async (status?: string, tradeMode?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authorization token found in localStorage");
        return;
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (tradeMode) queryParams.append('tradeMode', tradeMode);
      queryParams.append('page', '1');
      queryParams.append('limit', '50'); // Adjust limit as needed

      const response = await fetch(`${BASE_URL}/api/user/trades?${queryParams.toString()}`, {
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
  }, []);

  const submitTrade = useCallback(
    async (
      tradeData: Omit<Trade, "id" | "createdAt">,
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
          await fetchTrades(tradeData.status, tradeData.tradeMode); // Fetch with filters
          setAmount(0);
        } else {
          console.error("Failed to submit trade:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting trade:", error);
      }
    },
    [fetchTrades]
  );

  useEffect(() => {
    fetchTrades(); // Initial fetch without filters
  }, [fetchTrades]);

  return { trades, fetchTrades, submitTrade };
};
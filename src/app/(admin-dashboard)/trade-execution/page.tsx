"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Updated Trade type to match backend
export type Trade = {
  id: string; 
  tradeType: "buy" | "sell";
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  expectedPrice: number;
  executedPrice?: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  transactionId?: string;
  adminNotes?: string;
  approvedBy?: {
    email: string;
  };
  approvedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

const Admin = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const token = getAuthToken();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // Fetch trades on component mount
  const fetchTrades = useCallback(() => {
    async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/trades`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (Array.isArray(data.trades)) { // Backend sends trades in a "trades" array
          setTrades(data.trades);
        } else {
          setError("Invalid trade data format.");
        }
      } catch (error: any) {
        setError("Error fetching trades: " + error.message);
      } finally {
        setLoading(false);
      }
    };
  }, [BASE_URL, token])

  // Handle accepting or rejecting a trade
  const handleTradeAction = async (tradeId: string, action: "accept" | "reject") => {
    try {
      const newStatus = action === "accept" ? "approved" : "rejected";
      const response = await fetch(`${BASE_URL}/api/admin/trades/${tradeId}/process`, {
        method: "PUT", // Backend uses PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchTrades();
      } else {
        setError("Failed to update trade: " + response.statusText);
      }
    } catch (error: any) {
      setError("Error updating trade: " + error.message);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return (
    <div className="font-[Inter] w-full flex flex-col justify-start items-center">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Manage Trades</h1>

      {loading && <p className="text-gray-500 text-sm">Loading trades...</p>}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {trades.length > 0 ? (
        <div className="w-full space-y-3">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col space-y-3"
            >
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-600">
                  {new Date(trade.createdAt).toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {trade.tradeType.charAt(0).toUpperCase() + trade.tradeType.slice(1)} - {trade.amount} {trade.fromCurrency} to {trade.toCurrency}
                </span>
                <span
                  className={`text-xs ${
                    trade.status === "pending"
                      ? "text-yellow-500"
                      : trade.status === "approved"
                      ? "text-teal-500"
                      : trade.status === "rejected"
                      ? "text-red-500"
                      : trade.status === "completed"
                      ? "text-green-500"
                      : "text-gray-500" // For cancelled
                  }`}
                >
                  Status: {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
              </div>
              <div className="flex space-x-2">
                {trade.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleTradeAction(trade.id, "accept")}
                      className="flex-1 py-2 bg-theme_green text-white rounded-md text-sm font-medium hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleTradeAction(trade.id, "reject")}
                      className="flex-1 py-2 bg-theme_red text-white rounded-md text-sm font-medium hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 text-xs italic w-full text-center">Action completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-500 text-sm">No trades available.</p>
      )}
    </div>
  );
};

export default Admin;
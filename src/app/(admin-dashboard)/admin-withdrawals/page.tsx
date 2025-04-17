"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const AdminWithdrawals = () => {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch withdrawals
  useEffect(() => {
    const fetchWithdrawals = async () => {
      setIsLoading(true);
      setError(null);

      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found! Please log in again. 😓");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/withdrawals`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch withdrawals");
        }
        setWithdrawals(data);
      } catch (err: any) {
        setError(err.message || "Failed to load withdrawals. 😓");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/withdrawals/${id}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to approve withdrawal");
      }
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: "approved" } : w))
      );
      setSuccess("Withdrawal approved! Funds will be sent soon. 🎉");
    } catch (err: any) {
      setError(err.message || "Failed to approve withdrawal. 😓");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/withdrawals/${id}/reject`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reject withdrawal");
      }
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: "rejected" } : w))
      );
      setSuccess("Withdrawal rejected! User will be notified. 🚫");
    } catch (err: any) {
      setError(err.message || "Failed to reject withdrawal. 😓");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-col space-y-6 p-4 flex-1">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-[#0052FF]/10 text-[#0052FF] p-4 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Loading State */}
        {isLoading && withdrawals.length === 0 && (
          <div className="text-center text-gray-700">Loading withdrawals... ⏳</div>
        )}

        {/* Withdrawals List */}
        {withdrawals.length === 0 && !isLoading && (
          <div className="text-center text-gray-700">No pending withdrawals! 🎉</div>
        )}

        {withdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="bg-white p-6 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">UID:</p>
                <p className="text-sm text-gray-700">{withdrawal.uid}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">Amount:</p>
                <p className="text-sm text-gray-700">{withdrawal.amount} {withdrawal.token}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">Address:</p>
                <p className="text-sm text-gray-700 truncate max-w-[50%]">{withdrawal.address}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">Status:</p>
                <p className={`text-sm ${withdrawal.status === "pending" ? "text-yellow-500" : withdrawal.status === "approved" ? "text-[#0052FF]" : "text-red-500"}`}>
                  {withdrawal.status}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">Requested:</p>
                <p className="text-sm text-gray-700">{new Date(withdrawal.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {withdrawal.status === "pending" && (
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleApprove(withdrawal.id)}
                  className="flex-1 bg-cyan-500 text-white p-2 rounded-lg text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(withdrawal.id)}
                  className="flex-1 bg-red-500 text-white p-2 rounded-lg text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWithdrawals;
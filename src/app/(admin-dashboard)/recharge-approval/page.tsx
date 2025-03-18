"use client";
import React, { useState, useEffect, useCallback } from "react";

interface DepositAddress {
  _id: string;
  token: string;
  chain: string;
  address?: string;
  status: "pending" | "accepted" | "rejected";
  user: { email: string };
  amount?: number;
  screenshot?: string;
  createdAt?: string;
  updatedAt?: string;
}

const RechargeApprovalPage = () => {
  const [deposits, setDeposits] = useState<DepositAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchDeposits = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${BACKEND_URL}/api/admin/deposits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch deposits");
      }
      const data = await response.json();
      setDeposits(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching deposits");
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]); // Dependency: BACKEND_URL

  const handleStatusUpdate = useCallback(async (depositId: string, status: "accepted" | "rejected") => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setError("No authentication token found. Please log in.");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/api/admin/deposits/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id: depositId, status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${status} deposit`);
      }
      await fetchDeposits();
    } catch (err: any) {
      setError(err.message || `An error occurred while updating the deposit status to ${status}`);
    }
  }, [fetchDeposits, BACKEND_URL]); // Dependencies: fetchDeposits, BACKEND_URL

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]); // Dependency: fetchDeposits

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Deposit Approval</h1>

      {/* Table for larger screens */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">User Email</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Token</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Chain</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Screenshot</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deposits.map((deposit) => (
              <tr key={deposit._id}>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{deposit.user.email || "Unknown User"}</td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{deposit.token}</td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{deposit.chain}</td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{deposit.amount || "N/A"}</td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">
                  {deposit.screenshot ? (
                    <a
                      href={`${BACKEND_URL}${deposit.screenshot}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 capitalize">{deposit.status}</td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(deposit._id, "accepted")}
                    className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-xs sm:text-sm"
                    disabled={deposit.status !== "pending"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(deposit._id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 text-xs sm:text-sm"
                    disabled={deposit.status !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {deposits.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-500 text-center">
                  No pending deposit requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for smaller screens */}
      <div className="md:hidden space-y-4">
        {deposits.map((deposit) => (
          <div key={deposit._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">User Email:</span> {deposit.user.email || "Unknown User"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Token:</span> {deposit.token}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Chain:</span> {deposit.chain}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Amount:</span> {deposit.amount || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Screenshot:</span>{" "}
                {deposit.screenshot ? (
                  <a
                    href={`${BACKEND_URL}${deposit.screenshot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Status:</span> <span className="capitalize">{deposit.status}</span>
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate(deposit._id, "accepted")}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-xs"
                  disabled={deposit.status !== "pending"}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(deposit._id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 disabled:bg-gray-400 text-xs"
                  disabled={deposit.status !== "pending"}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {deposits.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 text-sm text-gray-500 text-center">
            No pending deposit requests.
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargeApprovalPage;
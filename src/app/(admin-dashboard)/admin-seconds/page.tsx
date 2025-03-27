"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import Navbar from "@/components/Navbar/Navbar";

interface Balance {
  currency: "USDT" | "BTC" | "USDC" | "ETH";
  amount: number;
}

interface User {
  id: string;
  uid: string;
  email?: string;
  phone?: string;
  role: "user" | "admin";
  balance: Balance[];
  isVerified: boolean;
  canWinSeconds: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AdminSeconds = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [secondsRequests, setSecondsRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"requests" | "users">("requests");

  // Fetch seconds requests
  const fetchSeconds = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/seconds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched seconds requests in frontend:', response);
      setSecondsRequests(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load seconds requests. 😓");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sanitizedUsers = response.data.map((user: User) => ({
        ...user,
        balance: user.balance.map((bal) => ({
          currency: bal.currency,
          amount: typeof bal.amount === "number" ? bal.amount : 0,
        })),
        canWinSeconds: user.canWinSeconds || false,
      }));
      setUsers(sanitizedUsers);
      setFilteredUsers(sanitizedUsers);
    } catch (err: any) {
      setError("Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn?.role !== "admin") {
      setError("You must be an admin to access this page.");
      setIsLoading(false);
      return;
    }

    fetchSeconds();
    fetchUsers();

    const pollInterval = setInterval(() => {
      fetchSeconds();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [isLoggedIn]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.uid.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleApprove = async (id: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/seconds/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message || "Seconds request approved! User will be credited. 🎉");
      fetchSeconds();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve seconds request. 😓");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/seconds/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message || "Seconds request rejected! User will be notified. 🚫");
      fetchSeconds();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reject seconds request. 😓");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCanWinSeconds = async (userId: string, currentStatus: boolean) => {
    try {
      setTogglingUserId(userId);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const newStatus = !currentStatus;
      const response = await axios.patch(
        `${BACKEND_URL}/api/admin/users/${userId}/can-win-seconds`,
        { canWinSeconds: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, canWinSeconds: newStatus } : user
        )
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((user) =>
          user.id === userId ? { ...user, canWinSeconds: newStatus } : user
        )
      );
    } catch (err: any) {
      setError("Failed to update canWinSeconds status: " + (err.response?.data?.message || err.message));
    } finally {
      setTogglingUserId(null);
    }
  };

  if (isLoading && secondsRequests.length === 0 && users.length === 0) {
    return (
      <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-white">
        <Navbar />
        <div className="text-center text-gray-700">Loading... ⏳</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-[#ECFBFE]">
        <Navbar />
        <div className="text-red-500 mt-4">{error}</div>
      </main>
    );
  }

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-white">
      <Navbar />
      <h1 className="text-2xl font-bold my-6">Admin Seconds Management</h1>

      {/* Tabs */}
      <div className="w-full max-w-4xl flex justify-start items-center border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "requests" ? "border-b-2 border-theme_green text-theme_green" : "text-gray-500"
          }`}
        >
          Seconds Requests
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "users" ? "border-b-2 border-theme_green text-theme_green" : "text-gray-500"
          }`}
        >
          Manage Users
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="w-full max-w-4xl bg-red-100 text-red-700 p-4 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full max-w-4xl bg-green-100 text-green-700 p-4 rounded-lg text-sm mb-4">
          {success}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "requests" && (
        <section className="w-full max-w-4xl bg-white rounded-[8px] shadow-box p-4">
          {secondsRequests.length === 0 && !isLoading && (
            <div className="text-center text-gray-700">No pending seconds requests! 🎉</div>
          )}
          {secondsRequests.map((request) => (
            <div key={request.id} className="border-b border-gray-200 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">UID:</p>
                  <p className="text-sm text-gray-700">{request.uid}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Seconds:</p>
                  <p className="text-sm text-gray-700">{request.seconds} seconds</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Amount:</p>
                  <p className="text-sm text-gray-700">{request.amount} USDT</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Status:</p>
                  <p
                    className={`text-sm ${
                      request.status === "pending"
                        ? "text-yellow-500"
                        : request.status === "approved"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {request.status}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Submitted:</p>
                  <p className="text-sm text-gray-700">
                    {new Date(request.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {request.status === "pending" && (
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 bg-cyan-500 text-white p-2 rounded-lg text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 bg-red-500 text-white p-2 rounded-lg text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {activeTab === "users" && (
        <section className="w-full max-w-4xl">
          <input
            type="text"
            placeholder="Search by UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <section className="bg-white rounded-[8px] shadow-box p-4">
            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center text-gray-700">No users found! 😓</div>
            )}
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border-b border-gray-200 py-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">
                    {user.email || user.phone || "Unknown User"} (UID: {user.uid}, {user.role})
                  </span>
                  <button
                    onClick={() => handleToggleCanWinSeconds(user.id, user.canWinSeconds)}
                    disabled={togglingUserId === user.id}
                    className={`px-2 py-1 rounded text-white ${
                      user.canWinSeconds ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    } ${togglingUserId === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {togglingUserId === user.id
                      ? "Updating..."
                      : user.canWinSeconds
                      ? "Disable canWinSeconds"
                      : "Enable canWinSeconds"}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span>Can Win Seconds:</span>
                  <span>{user.canWinSeconds ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            ))}
          </section>
        </section>
      )}
    </main>
  );
};

export default AdminSeconds;
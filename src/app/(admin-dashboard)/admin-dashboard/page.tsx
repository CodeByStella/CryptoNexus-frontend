// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
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
  uid: string; // Added UID
  email?: string;
  phone?: string;
  role: "user" | "admin";
  balance: Balance[];
  isVerified: boolean;
}

const AdminUsers = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // For search results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [balanceUpdates, setBalanceUpdates] = useState<{
    [key: string]: number;
  }>({ USDT: 0, BTC: 0, USDC: 0, ETH: 0 });
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input state

  useEffect(() => {
    if (isLoggedIn?.role !== "admin") {
      setError("You must be an admin to access this page.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || process.env.SERVER_RUL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sanitizedUsers = response.data.map((user: User) => ({
          ...user,
          balance: user.balance.map((bal) => ({
            currency: bal.currency,
            amount: typeof bal.amount === "number" ? bal.amount : 0,
          })),
        }));
        setUsers(sanitizedUsers);
        setFilteredUsers(sanitizedUsers); // Initially show all users
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isLoggedIn]);

  // Filter users based on search query
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.uid.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleEditClick = (userId: string) => {
    setEditUserId(userId);
    setBalanceUpdates({ USDT: 0, BTC: 0, USDC: 0, ETH: 0 });
  };

  const handleBalanceChange = (currency: string, value: string) => {
    setBalanceUpdates((prev) => ({
      ...prev,
      [currency]: value === "" ? 0 : parseFloat(value) || 0,
    }));
  };

  const handleSave = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const updatedBalance = user.balance.map((bal) => ({
        currency: bal.currency,
        amount: bal.amount + (balanceUpdates[bal.currency] || 0),
      }));

      const hasNegative = updatedBalance.some((b) => b.amount < 0);
      if (hasNegative) {
        setError("Cannot set balance below 0.");
        return;
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || process.env.SERVER_RUL}/api/admin/users/${userId}/balance`,
        { balance: updatedBalance },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, balance: updatedBalance } : u
        )
      );
      setEditUserId(null);
      setError(null);
    } catch (err) {
      setError("Failed to update balance.");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
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
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-[#ECFBFE]">
      <Navbar />
      <h1 className="text-2xl font-bold my-6">Manage Users</h1>
      <section className="w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="Search by UID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>
      <section className="w-full max-w-4xl bg-white rounded-[8px] shadow-box p-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id} // Changed back to user.id as it's unique
            className="border-b border-gray-200 py-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg">
                {user.email || user.phone || "Unknown User"} (UID: {user.uid}, {user.role})
              </span>
              <button
                onClick={() => handleEditClick(user.id)}
                className="text-blue-500 hover:underline"
              >
                Edit Balance
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {user.balance.map((bal) => (
                <div key={`${user.id}-${bal.currency}`} className="flex justify-between">
                  <span>{bal.currency}</span>
                  <span>{(bal.amount || 0).toFixed(6)}</span>
                </div>
              ))}
            </div>
            {editUserId === user.id && (
              <div className="mt-2 flex flex-col gap-2">
                {["USDT", "BTC", "USDC", "ETH"].map((currency) => (
                  <div key={`${user.id}-${currency}`} className="flex items-center gap-2">
                    <label>{currency} Change:</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={balanceUpdates[currency]}
                      onChange={(e) => handleBalanceChange(currency, e.target.value)}
                      className="border rounded p-1 w-24"
                      placeholder="e.g., 10 or -5"
                    />
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(user.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditUserId(null)}
                    className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default AdminUsers;
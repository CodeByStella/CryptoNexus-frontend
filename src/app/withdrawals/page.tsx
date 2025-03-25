"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store"; // Import RootState from @store

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CryptoWithdrawalInterface = () => {
  const router = useRouter();

  // State for form inputs
  const [amount, setAmount] = useState<number>(87);
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("USDT");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number } | null>(null);
  const [rateFetchError, setRateFetchError] = useState<string | null>(null);

  // Access user balance from Redux store
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const userBalance = isLoggedIn?.balance?.length ? isLoggedIn.balance : [];

  // Fetch exchange rates from CoinGecko
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin,binancecoin,ripple,solana,tether&vs_currencies=usdt"
        );
        const rates = response.data;
        console.log("Raw CoinGecko API response:", rates);
        const newRates = {
          USDT: 1, // Tether (USDT) to USDT is 1:1
          BTC: rates.bitcoin && rates.bitcoin.usdt ? 1 / rates.bitcoin.usdt : 0,
          ETH: rates.ethereum && rates.ethereum.usdt ? 1 / rates.ethereum.usdt : 0,
          USDC: rates["usd-coin"] && rates["usd-coin"].usdt ? 1 / rates["usd-coin"].usdt : 0,
          BNB: rates.binancecoin && rates.binancecoin.usdt ? 1 / rates.binancecoin.usdt : 0,
          XRP: rates.ripple && rates.ripple.usdt ? 1 / rates.ripple.usdt : 0,
          SOL: rates.solana && rates.solana.usdt ? 1 / rates.solana.usdt : 0,
        };
        console.log("Fetched exchange rates (1 USDT = X token):", newRates);
        setExchangeRates(newRates);
        setRateFetchError(null);
      } catch (err) {
        console.error("Failed to fetch exchange rates:", err);
        setRateFetchError("Failed to fetch exchange rates. Please try again later. 📉");
        setExchangeRates(null);
      }
    };
    fetchExchangeRates();
  }, []);

  // Log user balance for debugging
  console.log("userBalance:", userBalance);

  // Calculate total balance in USDT first
  const totalInUSDT = userBalance.reduce((sum: number, bal: { currency: string; amount: number }) => {
    if (!exchangeRates || !bal.currency || typeof bal.amount !== "number") {
      console.log(`Skipping balance entry: ${JSON.stringify(bal)} - Missing data`);
      return sum; // Skip invalid entries
    }
    const rateToUSDT = exchangeRates[bal.currency] ? 1 / exchangeRates[bal.currency] : 1; // Default to 1 if rate is missing
    const amountInUSDT = bal.amount * rateToUSDT;
    console.log(`Converting ${bal.amount} ${bal.currency} to USDT: ${amountInUSDT}`);
    return sum + (amountInUSDT || 0);
  }, 0);

  // Log total in USDT for debugging
  console.log("Total in USDT:", totalInUSDT);

  // Convert total balance to the selected token
  const totalInSelectedToken = exchangeRates && exchangeRates[selectedToken]
    ? totalInUSDT * exchangeRates[selectedToken]
    : 0;

  // Log total in selected token for debugging
  console.log(`Total in ${selectedToken}:`, totalInSelectedToken);

  // Calculate fee (1% of the amount) and arrival (amount - fee)
  const fee = amount * 0.01;
  const arrival = amount - fee;

  // List of tokens for the dropdown
  const tokens = ["USDT", "BTC", "ETH", "USDC"];

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Client-side validation
    if (amount < 10) {
      setError("Amount must be at least 10 USDT! 😅");
      setIsSubmitting(false);
      return;
    }
    if (!address.trim()) {
      setError("Please enter a withdrawal address! 🏠");
      setIsSubmitting(false);
      return;
    }
    if (!password.trim()) {
      setError("Please enter your withdrawal password! 🔒");
      setIsSubmitting(false);
      return;
    }
    if (totalInUSDT === 0 || amount > totalInUSDT) {
      setError("Insufficient balance! You don’t have enough USDT. 💸");
      setIsSubmitting(false);
      return;
    }

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/withdraw`,
        { amount, address, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message || "Withdrawal request submitted successfully");
      setAmount(0);
      setAddress("");
      setPassword("");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      if (errorMessage === "Please set a withdrawal password first") {
        setError(
          "For security reasons, set withdrawal password. " +
          "Go to settings to set it up."
        );
      } else if (errorMessage === "Invalid withdrawal password") {
        setError("Invalid withdrawal password! Please try again.");
      } else if (errorMessage === "Insufficient balance") {
        setError("Insufficient balance! You don’t have enough USDT.");
      } else if (errorMessage === "User not found") {
        setError("User not found! Please log in again.");
      } else {
        setError(errorMessage || "Something went wrong! Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      {/* Main Content */}
      <form onSubmit={handleSubmit} id="withdrawal-form" className="flex flex-col space-y-6 p-4 flex-1 pb-20">
        {/* Balance Section */}
        <div className="bg-cyan-500 p-6 rounded-lg text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm">Balance ({selectedToken})</p>
              <h1 className="text-4xl font-bold mt-2">
                {exchangeRates ? totalInSelectedToken.toFixed(2) : "Loading..."}
              </h1>
              <p className="text-xs mt-1 text-yellow-300">
                = {exchangeRates ? totalInUSDT.toFixed(2) : "0.00"} USDT
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm mr-2">Token</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-white text-black px-3 py-1 rounded flex items-center"
                >
                  <span>{selectedToken}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
                    {tokens.map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => {
                          setSelectedToken(token);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {rateFetchError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">
            {rateFetchError}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Amount Section */}
        <div className="bg-white p-6 rounded-lg">
          <p className="text-sm text-gray-700">Amount (USDT)</p>
          <div className="flex justify-between items-center border border-gray-300 rounded p-3 mt-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-1/2 text-base outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <span className="text-base text-gray-500">{amount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500">= {amount.toFixed(2)} USDT</p>
            <p className="text-xs text-gray-400">Minimum Amount: 10 USDT</p>
          </div>
        </div>

        {/* Fee and Arrival Section */}
        <div className="bg-white p-6 rounded-lg">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <p className="text-sm text-gray-700">Fee:</p>
            <p className="text-sm text-gray-700">{fee.toFixed(2)} USDT</p>
          </div>
          <div className="flex justify-between py-3">
            <p className="text-sm text-gray-700">Arrival:</p>
            <p className="text-sm text-cyan-500 font-medium">{arrival.toFixed(2)} USDT</p>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">Address</p>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              console.log("Address updated:", e.target.value); // Debug log
            }}
            placeholder="Address"
            className="w-full border border-gray-300 rounded p-3 text-base"
          />
        </div>

        {/* Password Section */}
        <div className="bg-white p-6 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">Withdraw password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              console.log("Password updated:", e.target.value); // Debug log
            }}
            className="w-full bg-blue-50 border border-gray-300 rounded p-3 text-base"
          />
          <p className="text-xs text-gray-500 mt-2">
            For the safety of your funds, please set a withdrawal password.
            <Link href="/set-withdrawal-password" className="text-cyan-500 ml-1">
              Go to settings
            </Link>
          </p>
        </div>
      </form>

      {/* Fixed Withdrawals Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100">
        <button
          type="submit"
          form="withdrawal-form"
          className="w-full bg-cyan-500 text-white p-4 rounded-lg text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Withdrawals"}
        </button>
      </div>
    </div>
  );
};

export default CryptoWithdrawalInterface;
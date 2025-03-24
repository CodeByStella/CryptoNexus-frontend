"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const SetWithdrawPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in both fields! 😅");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Oops! Passwords don’t match. Try again! 🙈");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long! 🔑");
      setIsSubmitting(false);
      return;
    }

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found! Please log in again. 😓");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/set-withdrawal-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to set password!");
      }
      setSuccess("Password set! You’re all secure now! 🎉");
      setPassword("");
      setConfirmPassword("");

      // Redirect to /withdrawals after a 2-second delay to show the success message
      setTimeout(() => {
        router.push("/withdrawals");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong! Please try again. 😓");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      {/* Main Content */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 flex-1">
        {/* Form Section */}
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-4">
            Let’s set a password to keep your funds safe! 🤑
          </p>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {/* Set Password Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-cyan-500 text-white p-3 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Set Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetWithdrawPassword;
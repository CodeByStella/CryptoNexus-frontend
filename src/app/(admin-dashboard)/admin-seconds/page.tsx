"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const AdminSeconds = () => {
  const router = useRouter();
  const [secondsRequests, setSecondsRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      console.log('Fetched seconds requests in frontend:', response); // Add logging
      setSecondsRequests(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load seconds requests. 😓");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeconds();

    const pollInterval = setInterval(() => {
      fetchSeconds();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

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

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <div className="flex flex-col space-y-6 p-4 flex-1">
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
        {isLoading && secondsRequests.length === 0 && (
          <div className="text-center text-gray-700">Loading seconds requests... ⏳</div>
        )}
        {secondsRequests.length === 0 && !isLoading && (
          <div className="text-center text-gray-700">No pending seconds requests! 🎉</div>
        )}
        {secondsRequests.map((request) => (
          <div key={request.id} className="bg-white p-6 rounded-lg">
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
                <p className={`text-sm ${request.status === "pending" ? "text-yellow-500" : request.status === "approved" ? "text-green-500" : "text-red-500"}`}>
                  {request.status}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">Submitted:</p>
                <p className="text-sm text-gray-700">{new Date(request.timestamp).toLocaleString()}</p>
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
      </div>
    </div>
  );
};

export default AdminSeconds;
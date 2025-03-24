"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  userEmail: string;
  userName: string;
  lastMessage: { content: string; createdAt: string; isAdminMessage: boolean };
  unreadCount: number;
}

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/admin/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [BASE_URL]);

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;

  return (
    <main className="min-h-screen bg-gray-100 font-[Inter] p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Support Tickets</h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center">No tickets available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.userEmail} className="py-4">
                <Link href={`/tickets/${encodeURIComponent(ticket.userEmail)}`}>
                  <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{ticket.userName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{ticket.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(ticket.lastMessage.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      {ticket.unreadCount > 0 && (
                        <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {ticket.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default TicketsPage;
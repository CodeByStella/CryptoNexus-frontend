"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { socketService } from "@/services/socketService";

interface Message {
  sender: string;
  content: string;
  avatar?: string;
  isAdminMessage?: boolean;
  senderName?: string;
  senderEmail?: string;
}

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const decodedId = id ? decodeURIComponent(id as string) : null;
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const adminEmail = isLoggedIn?.email || "admin@default.com";

  const [userName, setUserName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [noChat, setNoChat] = useState(false);

  const socket = socketService.getSocket();

  const loadChatData = useCallback(() => {
    if (!decodedId) return false;
    const storageKey = `chatData_${decodedId}`;
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const { messages, userName, timestamp } = JSON.parse(storedData);
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now - timestamp < threeDaysInMs) {
        setMessages(messages);
        setUserName(userName || "Unknown User");
        setNoChat(messages.length === 0);
        return true;
      } else {
        localStorage.removeItem(storageKey);
      }
    }
    return false;
  }, [decodedId]);

  const saveChatData = useCallback(() => {
    if (!decodedId) return;
    const storageKey = `chatData_${decodedId}`;
    const data = { messages, userName, timestamp: Date.now() };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [decodedId, messages, userName]);

  const sendMessage = useCallback(() => {
    if (!message.trim() || !decodedId) return;
    socket.emit("adminSendMessage", { email: decodedId, content: message });
    setMessage("");
    setNoChat(false);
  }, [decodedId, message, socket]);

  const closeChat = useCallback(() => {
    if (decodedId) {
      socket.emit("closeChat", decodedEmail);
      router.push("/tickets");
      localStorage.removeItem(`chatData_${decodedId}`);
    }
  }, [decodedId, router, socket]);

  useEffect(() => {
    if (!decodedId || !isLoggedIn) {
      setLoading(false);
      setNoChat(true);
      if (!isLoggedIn) router.push("/Login");
      return;
    }

    socketService.connect();
    const hasValidData = loadChatData();
    if (!hasValidData) {
      setMessages([]);
      setUserName("Unknown User");
      setNoChat(true);
    }
    setLoading(false);

    socket.emit("adminJoin", adminEmail);
    socket.emit("joinChat", decodedId);
    socket.emit("fetchMessages", decodedId);
  }, [decodedId, isLoggedIn, router, loadChatData, adminEmail, socket]);

  useEffect(() => {
    const handleMessagesFetched = (fetchedMessages: Message[]) => {
      console.log("Messages fetched:", fetchedMessages);
      if (!fetchedMessages || fetchedMessages.length === 0) {
        setNoChat(true);
      } else {
        setMessages(fetchedMessages);
        const userMessage = fetchedMessages.find((msg) => !msg.isAdminMessage);
        setUserName(userMessage?.senderName || "Unknown User");
        setNoChat(false);
      }
      saveChatData();
    };

    const handleUserMessage = (newMessage: Message) => {
      console.log("User message received:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setNoChat(false);
      saveChatData();
    };

    const handleAdminMessage = (adminMessage: Message) => {
      console.log("Admin message received:", adminMessage);
      // Only add if not from this admin
      if (adminMessage.senderEmail !== adminEmail) {
        setMessages((prev) => [...prev, adminMessage]);
        saveChatData();
      }
    };

    const handleChatClosed = (data: { email: string }) => {
      if (data.email === decodedId) {
        router.push("/tickets");
        localStorage.removeItem(`chatData_${decodedId}`);
      }
    };

    socket.on("messagesFetched", handleMessagesFetched);
    socket.on("userMessage", handleUserMessage);
    socket.on("adminMessage", handleAdminMessage);
    socket.on("chatClosed", handleChatClosed);

    return () => {
      socket.off("messagesFetched", handleMessagesFetched);
      socket.off("userMessage", handleUserMessage);
      socket.off("adminMessage", handleAdminMessage);
      socket.off("chatClosed", handleChatClosed);
    };
  }, [decodedId, adminEmail, saveChatData, socket]);

  useEffect(() => {
    saveChatData();
  }, [messages, userName, saveChatData]);

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  if (noChat)
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-gray-500">
        <p>No chat found for this user: {decodedId}</p>
        <button onClick={closeChat} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Back to Tickets
        </button>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-4">
      <div className="hidden md:flex md:w-1/2 p-8 flex-col justify-center items-start bg-white">
        <h1 className="text-3xl font-bold mb-4">Admin Support Dashboard</h1>
        <p className="text-lg text-gray-600">Manage and respond to user inquiries.</p>
      </div>
      <div className="flex-1 md:w-1/2 flex justify-end">
        <div className="w-full max-w-md bg-gray-100 border rounded-lg shadow-lg flex flex-col h-[calc(100vh-2rem)]">
          <div className="flex items-center justify-between p-4 bg-white border-b rounded-t-lg">
            <div className="text-xl font-medium">
              {userName} <span className="text-sm text-gray-500">({decodedId})</span>
            </div>
            <button onClick={closeChat} className="text-gray-600 text-xl">
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  {msg.sender !== "admin" && (
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                      {msg.avatar || "👤"}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                      msg.sender === "admin" ? "bg-teal-500 text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-white border-t rounded-b-lg">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Type your response..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-teal-500 text-white px-4 py-2 rounded-r-lg hover:bg-teal-600">
                Send
              </button>
            </div>
          </div>
          <div className="p-2 text-center text-xs text-gray-500 bg-white border-t">
            Powered by <span className="font-bold text-orange-500">LiveChat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
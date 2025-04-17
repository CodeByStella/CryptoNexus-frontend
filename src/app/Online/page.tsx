"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { socketService } from "@/services/socketService";

interface Message {
  sender: string;
  content: string;
  system?: boolean;
  avatar?: string;
  isForm?: boolean;
  isFormResult?: boolean;
}

const ChatForm = React.memo(({ name, setName, email, setEmail, startChat }: {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  startChat: () => void;
}) => {
  console.log("ChatForm render");
  return (
    <div className="p-4 bg-white rounded-lg w-full">
      <p className="mb-4">Welcome to our LiveChat! Please fill in the form below to start the chat.</p>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">E-mail:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <button onClick={startChat} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
        Start the chat
      </button>
    </div>
  );
});

ChatForm.displayName = "ChatForm";

const CustomerSupportChat = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const hasMounted = useRef(false);

  const socket = socketService.getSocket();

  // Load chat data from localStorage
  const loadChatData = useCallback(() => {
    const storedData = localStorage.getItem("chatData");
    if (storedData) {
      const { messages, name, email, chatStarted, timestamp } = JSON.parse(storedData);
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (now - timestamp < threeDaysInMs) {
        setMessages(messages);
        setName(name);
        setEmail(email);
        setChatStarted(chatStarted);
        return true;
      } else {
        localStorage.removeItem("chatData");
      }
    }
    return false;
  }, []);

  // Save chat data to localStorage
  const saveChatData = useCallback(() => {
    const data = {
      messages,
      name,
      email,
      chatStarted,
      timestamp: Date.now(),
    };
    localStorage.setItem("chatData", JSON.stringify(data));
  }, [messages, name, email, chatStarted]);

  // Initial setup (runs once on mount)
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    console.log("Initial setup ran");
    socketService.connect();

    const hasValidData = loadChatData();
    if (!hasValidData) {
      setMessages([{
        sender: "thirdParty",
        content: "Welcome to our LiveChat! Please fill in the form below to start the chat.",
        system: true,
        avatar: "🔵",
        isForm: true,
      }]);
    }
  }, [loadChatData]);

  // Join chat when chatStarted changes
  useEffect(() => {
    if (chatStarted && email) {
      console.log("Joining chat with email:", email);
      socket.emit("joinChat", email);
      socket.emit("fetchMessages", email);
    }
  }, [chatStarted, email, socket]);

  // Socket listeners
  useEffect(() => {
    console.log("Socket listeners setup");
    const handleMessagesFetched = (fetchedMessages: Message[]) => {
      console.log("Messages fetched:", fetchedMessages);
      if (fetchedMessages.length > 0) {
        setMessages((prevMessages) => {
          const existingMessages = prevMessages.filter((msg) => !msg.isForm && !msg.isFormResult);
          const newMessages = fetchedMessages.filter(
            (newMsg) => !existingMessages.some((msg) => msg.content === newMsg.content && msg.sender === newMsg.sender)
          );
          return [
            {
              sender: "thirdParty",
              content: "",
              system: true,
              avatar: "🔵",
              isFormResult: true,
            },
            ...existingMessages,
            ...newMessages,
          ];
        });
      }
    };

    const handleUserMessage = (newMessage: Message) => {
      console.log("User message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    const handleAdminMessage = (adminMessage: Message) => {
      console.log("Admin message:", adminMessage);
      setMessages((prev) => [...prev, adminMessage]);
    };

    const handleChatClosed = () => {
      console.log("Chat closed");
      setChatStarted(false);
      setMessages([{
        sender: "thirdParty",
        content: "Welcome to our LiveChat! Please fill in the form below to start the chat.",
        system: true,
        avatar: "🔵",
        isForm: true,
      }]);
      setName("");
      setEmail("");
      localStorage.removeItem("chatData");
    };

    socket.on("messagesFetched", handleMessagesFetched);
    socket.on("userMessage", handleUserMessage);
    socket.on("adminMessage", handleAdminMessage);
    socket.on("messageSent", (sentMessage) => console.log("Message sent:", sentMessage));
    socket.on("chatClosed", handleChatClosed);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("messagesFetched", handleMessagesFetched);
      socket.off("userMessage", handleUserMessage);
      socket.off("adminMessage", handleAdminMessage);
      socket.off("messageSent");
      socket.off("chatClosed");
    };
  }, [socket]);

  // Save data when messages change
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Saving chat data");
      saveChatData();
    }
  }, [messages, saveChatData]);

  const startChat = useCallback(() => {
    if (name && email) {
      console.log("Starting chat with:", { name, email });
      setChatStarted(true);
      setMessages([{
        sender: "thirdParty",
        content: "",
        system: true,
        avatar: "🔵",
        isFormResult: true,
      }]);
    }
  }, [name, email]);

  const sendMessage = useCallback(() => {
    if (message.trim()) {
      const newMessage = { sender: "user", content: message };
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("sendMessage", { name, email, content: message });
      setMessage("");
    }
  }, [message, name, email, socket]);

  const closeChat = useCallback(() => {
    setChatStarted(false);
    socket.emit("closeChat", email);
    setMessages([{
      sender: "thirdParty",
      content: "Welcome to our LiveChat! Please fill in the form below to start the chat.",
      system: true,
      avatar: "🔵",
      isForm: true,
    }]);
    setName("");
    setEmail("");
    localStorage.removeItem("chatData");
  }, [email, socket]);

  const renderFormMessage = useCallback((msg: Message) => (
    <ChatForm
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      startChat={startChat}
    />
  ), [name, email, startChat]);

  const renderFormResultMessage = useCallback(() => (
    <div className="p-4 bg-white rounded-lg w-full">
      <div className="mb-1">
        <span className="font-medium">Name:</span> {name}
      </div>
      <div>
        <span className="font-medium">E-mail:</span> {email}
      </div>
    </div>
  ), [name, email]);

  console.log("Render");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main container: Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row fle1 w-full mx-auto p-4 gap-4 h-screen">
        {/* Left Section: Hidden on mobile, full-width on small screens */}
        <div className="hidden lg:flex lg:w-full p-4 flex-col justify-center items-end bg-white rounded-lg">
          <h1 className="text-5xl font-bold mb-4 ">Welcome to Customer Support</h1>
          <p className="text-base text-gray-600">
            We&apos;re here to assist you with any questions or issues you might have. Start chatting with our support team!
          </p>
        </div>

        {/* Right Section: Chat Container */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="w-full lg:max-w-md bg-gray-100 border border-gray-200 rounded-lg shadow-lg flex flex-col h-[calc(100vh-2rem)] lg:h-auto lg:max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center">
                <div className="text-lg font-medium">
                  {chatStarted ? `${name}'s Chat` : "LiveChat"}
                </div>
              </div>
              <div className="flex items-center justify-center">
                {chatStarted && (
                  <div className="flex space-x-3">
                    <button className="text-xl">👍</button>
                    <button className="text-xl">👎</button>
                  </div>
                )}
              </div>
              {chatStarted && (
                <button onClick={closeChat} className="text-gray-600">
                  ✕
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-2">
                    <span className="text-xl">Λ</span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-[#0052FF] rounded-full border-2 border-white"></span>
                  </div>
                  <h2 className="text-lg font-bold">Online Help</h2>
                  <p className="text-xs text-gray-600">customer service</p>
                </div>

                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender !== "user" && (
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full ${msg.sender === "admin" ? "bg-black" : "bg-blue-500"} text-white mr-2`}>
                        {msg.avatar}
                      </div>
                    )}
                    <div className={`max-w-[85%] ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-white"} rounded-lg shadow-sm`}>
                      {msg.isForm ? renderFormMessage(msg) : msg.isFormResult ? renderFormResultMessage() : (
                        <div className="p-3">{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            {chatStarted && (
              <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-lg p-2 text-sm"
                    placeholder="Write a message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <div className="flex">
                    <button className="bg-gray-100 border border-gray-300 border-r-0 p-2 text-sm">😊</button>
                    <button className="bg-gray-100 border border-gray-300 border-r-0 p-2 text-sm">➕</button>
                    <button
                      onClick={sendMessage}
                      className="bg-gray-100 border border-gray-300 rounded-r-lg p-2 text-blue-500 text-sm"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-2 text-center text-xs text-gray-500 bg-white border-t border-gray-200">
              Powered by <span className="font-bold text-orange-500">LiveChat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportChat;
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar"; 
import { Menu, X } from "lucide-react"; 
import { useSelector, useDispatch } from "react-redux"; 
import { RootState } from "@/store"; 
import { useRouter } from "next/navigation"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!isLoggedIn || !isLoggedIn.role || isLoggedIn.role !== "admin") {
      router.push("/Login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !isLoggedIn.role || isLoggedIn.role !== "admin") {
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <main className="flex-1 p-4 pb-20">
        {children}
      </main>
    </div>
  );
}
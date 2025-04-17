// app/user/profile/page.tsx
"use client";

import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { FaAngleRight } from "react-icons/fa"; // React Icon for greater than

const UserProfile = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  // Dynamically fetch user details with fallbacks
  const uid = isLoggedIn?.uid || "N/A";
  const email = isLoggedIn?.email || "Unknown User";
  const creditScore = 100;
  const isVerified = false;
  const language = "English";
  const billing = "USD";

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated (handled by AuthWrapper ideally)
      // Note: Avoid direct router.push here; rely on AuthWrapper
    }
  }, [isLoggedIn]);

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col items-center bg-white px-4 py-6 relative">
      <Navbar />

      {/* Header Section */}
      <section className="w-full max-w-3xl flex flex-col items-center mb-6">
        <div className="flex items-center w-full justify-between mb-4">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-700">{email}</span>
            {isVerified && (
              <Image
                src="/assets/icons/verified-badge.png" // Replace with your verified badge image path
                alt="Verified Badge"
                width={20}
                height={20}
                className="ml-2"
              />
            )}
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">UID: {uid} </span>
            <span className="text-sm font-bold text-[#0052FF] ml-2">
              Credit score: {creditScore}
            </span>
          </div>
        </div>

        {/* Security Improvement Banner */}
        <div className="w-full bg-[#0052FF] text-white p-3 rounded-lg flex justify-between items-center mb-6">
          <span>Improve account security</span>
          <button className="text-white underline">View</button>
        </div>

        {/* Menu Section */}
        <section className="w-full bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between space-y-4 ">
            <button className="flex items-center text-gray-700 hover:text-theme-green">
              <Image
                src="/assets/icons/security.png" // Replace with your icon path
                alt="Security Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <span>Security</span>
            </button>
            <button className="flex items-center text-gray-700 hover:text-theme-green">
              <Image
                src="/assets/icons/kyc.png" // Replace with your icon path
                alt="KYC Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <span>KYC</span>
            </button>
            <button className="flex items-center text-gray-700 hover:text-theme-green">
              <Image
                src="/assets/icons/verify.png" // Replace with your icon path
                alt="Verify Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <span>Verify</span>
            </button>
            <button className="flex items-center text-gray-700 hover:text-theme-green">
              <Image
                src="/assets/icons/adviser.png" // Replace with your icon path
                alt="Advisor Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <span>Advisor</span>
            </button>
          </div>

          {/* VIP Level and Other Settings */}
          <div className="mt-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">VIP Level</span>
              <FaAngleRight className="text-gray-500" />
            </div>
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">Language</span>
              <span className="flex items-center text-gray-500">
                {language} <FaAngleRight />
              </span>
            </div>
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">Billing</span>
              <span className="flex items-center text-gray-500">
                {billing} <FaAngleRight />
              </span>
            </div>
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">Audit report</span>
              <FaAngleRight className="text-gray-500" />
            </div>
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">MSB</span>
              <FaAngleRight className="text-gray-500" />
            </div>
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">White Paper</span>
              <FaAngleRight className="text-gray-500" />
            </div>
            <div className="flex items-center justify-between shadow-md p-2 rounded-lg">
              <span className="text-gray-700">APP Version</span>
              <FaAngleRight className="text-gray-500" />
            </div>
          </div>
        </section>
      </section>

      {/* Responsive Design */}
      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-3xl {
            max-width: 100%;
          }
          .flex-col > div {
            flex-direction: column;
            align-items: flex-start;
          }
          .flex-col > div > span {
            margin-top: 0.5rem;
          }
          .bg-theme-green {
            flex-direction: column;
            text-align: center;
          }
          .bg-theme-green button {
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </main>
  );
};

export default UserProfile;
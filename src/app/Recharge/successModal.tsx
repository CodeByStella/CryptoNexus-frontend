import React from "react";
import Image from "next/image";

interface SuccessModalProps {
  onClose: () => void;
  onCheckOrder: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, onCheckOrder }) => {
  const timestamp = new Date().toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm flex flex-col items-center">
        {/* Checkmark Icon */}
        <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Order Submitted Text */}
        <h2 className="text-xl font-semibold text-black mb-2">Order Submitted</h2>

        {/* Timestamp */}
        <p className="text-sm text-gray-500 mb-4">{timestamp}</p>

        {/* Message */}
        <p className="text-sm text-gray-600 text-center mb-6">
          The order has been submitted, if it has not arrived?{" "}
          <span className="text-teal-500 cursor-pointer">Contact Online Service</span>
        </p>

        {/* Check Order Button */}
        <button
          onClick={onCheckOrder}
          className="w-full bg-teal-500 text-white rounded-lg py-3"
        >
          Check Order
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
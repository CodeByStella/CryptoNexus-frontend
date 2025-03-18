// pages/Contracts.tsx
"use client"
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link"; // Added for navigation
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import PriceTable from "@/components/PriceTable/PriceTable";

// CryptoPrice and Trade types remain unchanged
export type CryptoPrice = {
  c: number;
  o: number;
  h: number;
  l: number;
  v: number;
  m: string;
  bv: number;
  ch: number;
  icon: string;
  lineChart: string;
  channel?: string | null;
  scode?: string | null;
  T?: string | null;
  t?: string | null;
};

export type Trade = {
  id: string;
  user: string;
  tradeType: "buy" | "sell";
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  expectedPrice: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

// DropUp, PageHeader, Sidebar, fetchTrades, submitTrade, Spot, Swap, Seconds components remain unchanged
const DropUp = ({
  dropUpOpen,
  closeDropUp,
  data,
  setSelectedOption,
}: {
  dropUpOpen: Boolean;
  closeDropUp: () => void;
  data: string[] | number[];
  setSelectedOption: (p: any) => void;
}) => {
  const dropUpVariants = { hidden: { y: "100%" }, visible: { y: "0%" } };
  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  return (
    <AnimatePresence>
      {dropUpOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeDropUp}
        >
          <motion.div
            className="absolute bottom-0 w-full bg-white flex flex-col items-center justify-center"
            variants={dropUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {data.map((e: string | number, i) => (
              <span
                key={i}
                onClick={() => {
                  setSelectedOption(e);
                  closeDropUp();
                }}
                className="w-full text-center py-2 border-b border-gray-300 text-lg font-normal cursor-pointer"
              >
                {e}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type PageHeaderProps = {
  tabs: string[];
  currentTab: string;
  setCurrentTab: (data: string) => void;
};

const PageHeader = ({ tabs, currentTab, setCurrentTab }: PageHeaderProps) => {
  return (
    <section className="w-full flex justify-between items-center px-[20px] mt-[12px]">
      {tabs.map((each, i) => (
        <section
          key={i}
          className="cursor-pointer flex flex-col justify-start items-center"
        >
          <span
            onClick={() => setCurrentTab(each)}
            className={`mb-[8px] inline-block ${
              each === currentTab ? `text-theme_green` : `text-black`
            }`}
          >
            {each}
          </span>
          <div
            className={`${
              each === currentTab ? `opacity-1` : `opacity-0`
            } w-[45px] h-[3px] bg-theme_green`}
          ></div>
        </section>
      ))}
    </section>
  );
};

type SidebarProps = {
  sidebarOpen: Boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  setCurrentToken: (t: CryptoPrice) => void;
};

const Sidebar = ({
  closeSidebar,
  setCurrentToken,
  sidebarOpen,
  cryptoPrices,
}: SidebarProps & { cryptoPrices: CryptoPrice[] }) => {
  const sidebarVariants = { hidden: { x: "-100%" }, visible: { x: "0%" } };
  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeSidebar}
        >
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white px-[23px] pt-[25px] w-[70vw] max-w-[250px]"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <section className="text-[#9d9d9d] w-full flex font-light justify-between items-center">
              <span>Name</span>
              <span>Prices/24H</span>
            </section>
            <section className="w-full h-[75vh] mt-[8px] overflow-y-auto hide-scrollbar">
              {cryptoPrices.map((e, i) => (
                <section
                  key={i}
                  onClick={() => {
                    setCurrentToken(e);
                    closeSidebar();
                  }}
                  className="w-full cursor-pointer flex justify-between items-start py-[4px] border-b-[1px] border-[#e4e3e3]"
                >
                  <span>{e.m}</span>
                  <section className="flex flex-col justify-start items-end">
                    <span>{e.c}</span>
                    <span
                      className={`mt-[5px] ${
                        e.ch > 0 ? "text-theme_green" : "text-theme_red"
                      }`}
                    >
                      {e.ch > 0 ? "+" : "-"}
                      {Math.abs(e.ch * 100).toFixed(2)}%
                    </span>
                  </section>
                </section>
              ))}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const fetchTrades = async (setTrades: React.Dispatch<React.SetStateAction<Trade[]>>) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authorization token found in localStorage");
      return;
    }

    const response = await fetch("process.env.SERVER_RUL/api/user/trades", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    const data = await response.json();
    if (Array.isArray(data.trades)) {
      setTrades(data.trades);
    } else {
      console.error("Invalid trade data format:", data);
    }
  } catch (error) {
    console.error("Error fetching trades:", error);
  }
};

const submitTrade = async (tradeData: any, setAmount: React.Dispatch<React.SetStateAction<number>>, fetchTrades: () => void) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authorization token found in localStorage");
      return;
    }

    const response = await fetch("process.env.SERVER_RUL/api/user/trade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tradeData),
    });

    if (response.ok) {
      await fetchTrades();
      setAmount(0);
    } else {
      console.error("Failed to submit trade:", response.statusText);
    }
  } catch (error) {
    console.error("Error submitting trade:", error);
  }
};

const Spot = ({ marketPrice }: { marketPrice: number }) => {
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [value, setValue] = useState(0);
  const steps = [0, 25, 50, 75, 100];
  const [trades, setTrades] = useState<Trade[]>([]);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    fetchTrades(setTrades);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    const closestStep = steps.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    );
    setValue(closestStep);
  };

  const handleSubmit = () => {
    const newTrade = {
      tradeType: tradeAction,
      fromCurrency: tradeAction === "buy" ? "USDT" : "BTC",
      toCurrency: tradeAction === "buy" ? "BTC" : "USDT",
      amount: amount || 0,
      expectedPrice: marketPrice,
    };
    submitTrade(newTrade, setAmount, () => fetchTrades(setTrades));
  };

  return (
    <section className="w-full flex flex-col justify-start items-center">
      <section className="w-full flex justify-between items-center mb-[20px]">
        <section className="w-[48%] flex flex-col justify-start items-center">
          <div className="relative w-full h-[30px] border border-theme_green rounded-[3px] flex items-center overflow-hidden">
            <div
              className={`absolute w-1/2 h-full bg-theme_green transition-transform duration-300 ease-in-out ${
                tradeAction === "sell" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <div className="relative flex w-full text-center font-semibold cursor-pointer">
              <div
                className={`cursor-pointer w-1/2 z-10 py-2 font-normal text-[14px] transition-colors duration-300 ${
                  tradeAction === "buy" ? "text-white" : "text-black"
                }`}
                onClick={() => setTradeAction("buy")}
              >
                Buy
              </div>
              <div
                className={`cursor-pointer w-1/2 z-10 py-2 font-normal text-[14px] transition-colors duration-300 ${
                  tradeAction === "sell" ? "text-white" : "text-black"
                }`}
                onClick={() => setTradeAction("sell")}
              >
                Sell
              </div>
            </div>
          </div>
          <div className="w-full mt-[9px] rounded-[5px] p-[10px] flex justify-start text-[14px] bg-[#F5F7FA]">
            Market price
          </div>
          <div className="w-full my-[9px] rounded-[5px] p-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span>{marketPrice.toFixed(4)}</span>
            <span className="text-[#8A8A8A]">USDT</span>
          </div>
          <div className="w-full mb-[7px] rounded-[5px] p-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span className="text-[#C0C4CC] text-[17px]">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-[60px] border border-gray-300 rounded p-1 text-right"
              placeholder="0"
            />
          </div>
          <div className="w-full flex flex-col items-center mb-[16px] mt-[12px]">
            <div className="relative w-full h-2 flex items-center">
              <div className="absolute w-full h-[2.5px] bg-[#e0e0e0] rounded-[8px]" />
              <div
                className="absolute h-[2.5px] bg-theme_green rounded-[8px]"
                style={{ width: `${value}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={value}
                onChange={handleChange}
                className="w-full appearance-none bg-transparent cursor-pointer"
                style={{ WebkitAppearance: "none", appearance: "none" }}
              />
            </div>
            <div className="flex justify-between w-full text-xs mt-[16px]">
              {steps.map((step) => (
                <span key={step} className="text-[silver]">
                  {step}%
                </span>
              ))}
            </div>
            <style>
              {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width:17px;
            height:17px;
            background-color: #22A2B3;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
          }
          input[type="range"]::-moz-range-thumb {
            width: 17px;
            height:17px;
            background-color: #22A2B3;
            border-radius: 50%;
            cursor: pointer;
          }
        `}
            </style>
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Pay</span>
            <span>0 USDT</span>
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Available</span>
            <span>0 USDT</span>
          </div>
          <button
            className={`w-full h-[45px] text-white rounded-[3px] mt-[7px] ${
              tradeAction === "buy" ? "bg-theme_green" : "bg-theme_red"
            }`}
            onClick={handleSubmit}
          >
            {tradeAction === "buy" ? "Buy" : "Sell"}
          </button>
          <section className="mt-[12px] w-full flex justify-start items-center">
            <span className="text-[16px] font-medium">Commissioned orders</span>
          </section>
        </section>
        <section className="w-[48%]">
          <PriceTable />
        </section>
      </section>
      <section className="w-full mt-[10px]">
        <h3 className="text-[16px] font-medium mb-[10px]">Pending Trades</h3>
        {trades.length > 0 ? (
          <div className="space-y-3">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="p-3 pt-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="text-[12px] text-gray-600 mr-2">
                    {new Date(trade.createdAt).toLocaleString()}
                  </span>
                  <figure className="w-[16px] h-[16px] relative">
                    {/* <Image src="/assets/icons/refresh.png" alt="Refresh icon" fill /> */}
                  </figure>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[12px] text-gray-600">
                    {trade.tradeType === "buy" ? `${trade.amount.toFixed(4)} ${trade.fromCurrency}` : `${trade.amount.toFixed(4)} ${trade.fromCurrency}`}
                  </span>
                  <span
                    className={`text-[12px] font-medium ${
                      trade.tradeType === "buy" ? "text-theme_green" : "text-theme_red"
                    }`}
                  >
                    {trade.tradeType.charAt(0).toUpperCase() + trade.tradeType.slice(1)}
                  </span>
                  <span className="text-[12px] text-gray-600">
                    {trade.tradeType === "sell" ? `${(trade.amount * trade.expectedPrice).toFixed(4)} ${trade.toCurrency}` : `${trade.amount.toFixed(4)} ${trade.toCurrency}`}
                  </span>
                </div>
                <span className="text-[12px] text-teal-500">
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-[12px]">No pending trades.</p>
        )}
      </section>
    </section>
  );
};

const Swap = ({ marketPrice }: { marketPrice: number }) => {
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [dropUpOpen, setDropupOpen] = useState<Boolean>(false);
  const [value, setValue] = useState(0);
  const steps = [0, 25, 50, 75, 100];
  const [trades, setTrades] = useState<Trade[]>([]);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    fetchTrades(setTrades);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    const closestStep = steps.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    );
    setValue(closestStep);
  };

  const openDropup = () => setDropupOpen(true);
  const closeDropUp = () => setDropupOpen(false);

  const handleSubmit = () => {
    const newTrade = {
      tradeType: tradeAction,
      fromCurrency: "USDT",
      toCurrency: "Sheets",
      amount: amount || 0,
      expectedPrice: marketPrice,
    };
    submitTrade(newTrade, setAmount, () => fetchTrades(setTrades));
  };

  const [bottomTab, setBottomTab] = useState<string>("Position");
  const dropUpData: number[] = [10, 20, 30, 40, 50];
  const [selectedOption, setSelectedOption] = useState<number>(dropUpData[0]);

  return (
    <section className="w-full flex flex-col justify-start items-center pb-[90px] relative">
      <DropUp
        data={dropUpData}
        setSelectedOption={setSelectedOption}
        closeDropUp={closeDropUp}
        dropUpOpen={dropUpOpen}
      />
      <section className="w-full flex justify-between items-center mb-[20px]">
        <section className="w-[48%] flex flex-col justify-start items-center">
          <button className="w-full flex h-[32px] justify-center items-center font-bold text-[12px] text-white rounded-[4px] bg-theme_green">
            Open
          </button>
          <div className="w-full mt-[9px] rounded-[5px] p-[10px] flex justify-center text-[14px] bg-[#F5F7FA]">
            Market price
          </div>
          <div className="w-full my-[9px] rounded-[5px] p-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span>{marketPrice.toFixed(4)}</span>
            <span className="text-[#8A8A8A]">USDT</span>
          </div>
          <div className="w-full mb-[7px] rounded-[5px] p-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span className="text-[#C0C4CC] text-[17px]">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-[60px] border border-gray-300 rounded p-1 text-right"
              placeholder="0"
            />
          </div>
          <div className="w-full flex flex-col items-center mb-[16px] mt-[12px]">
            <div className="relative w-full h-2 flex items-center">
              <div className="absolute w-full h-[2.5px] bg-[#e0e0e0] rounded-[8px]" />
              <div
                className="absolute h-[2.5px] bg-theme_green rounded-[8px]"
                style={{ width: `${value}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={value}
                onChange={handleChange}
                className="w-full appearance-none bg-transparent cursor-pointer"
                style={{ WebkitAppearance: "none", appearance: "none" }}
              />
            </div>
            <div className="flex justify-between w-full text-xs mt-[16px]">
              {steps.map((step) => (
                <span key={step} className="text-[silver]">
                  {step}%
                </span>
              ))}
            </div>
            <style>
              {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width:17px;
            height:17px;
            background-color: #22A2B3;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
          }
          input[type="range"]::-moz-range-thumb {
            width: 17px;
            height:17px;
            background-color: #22A2B3;
            border-radius: 50%;
            cursor: pointer;
          }
        `}
            </style>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Pay</span>
            <span>0 USDT</span>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Amount</span>
            <span>0.0000 Sheets</span>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Available</span>
            <span>0 USDT</span>
          </div>
          <button
            className="cursor-pointer w-full h-[45px] text-white rounded-[3px] mt-[7px] bg-theme_green flex items-center justify-end"
            onClick={() => {
              setTradeAction("buy");
              handleSubmit();
            }}
          >
            <section className="w-[60%] flex justify-between items-center">
              <span>Long</span>
              <span className="text-[12px] opacity-[.6] mr-[9px]">Up</span>
            </section>
          </button>
          <button
            className="cursor-pointer w-full h-[45px] text-white rounded-[3px] mt-[10px] bg-theme_red flex items-center justify-end"
            onClick={() => {
              setTradeAction("sell");
              handleSubmit();
            }}
          >
            <section className="w-[60%] flex justify-between items-center">
              <span>Short</span>
              <span className="text-[12px] opacity-[.6] mr-[9px]">Down</span>
            </section>
          </button>
        </section>
        <section className="w-[48%]">
          <PriceTable swap={true} openList={openDropup} />
        </section>
      </section>
      <section className="w-full flex flex-col justify-start items-center">
        <section className="mt-[20px] w-full flex justify-start items-center border-[#e4e3e3] border-b">
          <section className="text-[12px] font-normal w-full flex justify-start items-center">
            {["Position", "Record"].map((each, i) => (
              <section
                key={i}
                className="cursor-pointer flex flex-col justify-start items-start"
              >
                <span
                  onClick={() => setBottomTab(each)}
                  className={`${i === 0 && "mr-[15px]"} mb-[8px] inline-block ${
                    each === bottomTab ? `text-theme_green` : `text-black`
                  }`}
                >
                  {each}
                </span>
                <div
                  className={`${
                    each === bottomTab ? `opacity-1` : `opacity-0`
                  } w-[45px] h-[3px] bg-theme_green`}
                ></div>
              </section>
            ))}
          </section>
        </section>
        <section className="w-full flex justify-center items-center">
          <section className="flex flex-col justify-start items-center">
            <figure className="w-[150px] h-[150px] relative">
              {/* <Image src="/assets/images/Nodate.svg" alt="Info image" fill /> */}
            </figure>
            {/* <span className="text-[#C0C4CC] font-[20px]">Empty</span> */}
          </section>
        </section>
      </section>
      <section className="w-full mt-[10px]">
        <h3 className="text-[16px] font-medium mb-[10px]">Pending Trades</h3>
        {trades.length > 0 ? (
          <div className="space-y-3">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="p-3 pt-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="text-[12px] text-gray-600 mr-2">
                    {new Date(trade.createdAt).toLocaleString()}
                  </span>
                  <figure className="w-[16px] h-[16px] relative">
                    {/* <Image src="/assets/icons/refresh.png" alt="Refresh icon" fill /> */}
                  </figure>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[12px] text-gray-600">
                    {trade.tradeType === "buy" ? `${trade.amount.toFixed(4)} ${trade.fromCurrency}` : `${trade.amount.toFixed(4)} ${trade.fromCurrency}`}
                  </span>
                  <span
                    className={`text-[12px] font-medium ${
                      trade.tradeType === "buy" ? "text-theme_green" : "text-theme_red"
                    }`}
                  >
                    {trade.tradeType.charAt(0).toUpperCase() + trade.tradeType.slice(1)}
                  </span>
                  <span className="text-[12px] text-gray-600">
                    {trade.tradeType === "sell" ? `${(trade.amount * trade.expectedPrice).toFixed(4)} ${trade.toCurrency}` : `${trade.amount.toFixed(4)} ${trade.toCurrency}`}
                  </span>
                </div>
                <span className="text-[12px] text-teal-500">
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-[12px]">No pending trades.</p>
        )}
      </section>
    </section>
  );
};

const Seconds = ({ marketPrice }: { marketPrice: number }) => {
  const [dropUpOpen, setDropupOpen] = useState<Boolean>(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const openDropup = () => setDropupOpen(true);
  const closeDropUp = () => setDropupOpen(false);
  const dropUpData: string[] = ["10s Up", "20s Up", "30s Up", "40s Up", "50s Up", "60s Up", "10s Down", "20s Down", "30s Down", "40s Down", "50s Down", "60s Down"];
  const [selectedOption, setSelectedOption] = useState<string>(dropUpData[0]);
  const [bottomTab, setBottomTab] = useState<string>("Position");

  useEffect(() => {
    fetchTrades(setTrades);
  }, []);

  const handleSubmit = () => {
    const newTrade = {
      tradeType: selectedOption.includes("Up") ? "buy" : "sell",
      fromCurrency: "USDT",
      toCurrency: "USDT",
      amount: amount || 0,
      expectedPrice: marketPrice,
    };
    submitTrade(newTrade, setAmount, () => fetchTrades(setTrades));
  };

  return (
    <section className="w-full flex flex-col justify-start items-center relative">
      <DropUp
        closeDropUp={closeDropUp}
        data={dropUpData}
        dropUpOpen={dropUpOpen}
        setSelectedOption={setSelectedOption}
      />
      <section className="w-full flex justify-between items-start mb-[20px]">
        <section className="w-[48%] flex flex-col justify-start items-center">
          <section className="w-full flex justify-between items-center text-[11px]">
            <span>Delivery time</span>
            <section
              onClick={openDropup}
              className="w-[50%] rounded-[5px] p-[5px] flex justify-between items-center bg-[#F5F7FA]"
            >
              <span>{selectedOption}</span>
              <div className="v-icon"></div>
            </section>
          </section>
          <section className="w-full flex flex-col justify-start items-start">
            <span className="text-[11px] my-[7px]">Scope and return</span>
            <section className="w-full rounded-[5px] p-[7px] flex justify-between items-center bg-[#F5F7FA]">
              <section className="flex justify-start items-center">
                <figure className="relative w-[20px] h-[20px] mr-[8px]">
                  <Image src="/assets/images/Up.svg" alt="Up image" fill />
                </figure>
                <span className="text-theme_green text-[12px]">Up ≥ 0.25%</span>
              </section>
              <span className="text-[silver] text-[12px] font-light">(*6%)</span>
            </section>
            <section className="my-[7px] w-full rounded-[5px] p-[7px] flex justify-between items-center bg-[#F5F7FA]">
              <section className="flex justify-start items-center">
                <figure className="relative w-[20px] h-[20px] mr-[8px]">
                  <Image src="/assets/images/Down.svg" alt="Up image" fill />
                </figure>
                <span className="text-theme_red text-[12px]">Down ≥ 0.15%</span>
              </section>
              <span className="text-[silver] text-[12px] font-light">(*6%)</span>
            </section>
            <span className="text-[11px] mb-[7px]">
              Limit: <span className="font-light text-theme_green">500-99999999</span>
            </span>
          </section>
          <div className="w-full mb-[7px] rounded-[5px] py-[8px] px-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span className="text-[#C0C4CC] text-[17px]">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-[60px] border border-gray-300 rounded p-1 text-right"
              placeholder="0"
            />
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Balance</span>
            <span>0 USDT</span>
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Expected</span>
            <span>0 USDT</span>
          </div>
          <button
            className="cursor-pointer w-full h-[45px] text-white rounded-[3px] mt-[7px] bg-theme_green flex items-center justify-end"
            onClick={handleSubmit}
          >
            <section className="w-[60%] flex justify-between items-center">
              <span>Long</span>
              <span className="text-[12px] opacity-[.6] mr-[9px]">Up</span>
            </section>
          </button>
          <button
            className="cursor-pointer w-full h-[45px] text-white rounded-[3px] mt-[10px] bg-theme_red flex items-center justify-end"
            onClick={handleSubmit}
          >
            <section className="w-[60%] flex justify-between items-center">
              <span>Short</span>
              <span className="text-[12px] opacity-[.6] mr-[9px]">Down</span>
            </section>
          </button>
        </section>
        <section className="w-[48%]">
          <PriceTable />
        </section>
      </section>
      <section className="w-full flex flex-col justify-start items-center">
        <section className="mt-[20px] w-full flex justify-start items-center border-[#e4e3e3] border-b">
          <section className="text-[12px] font-normal w-full flex justify-start items-center">
            {["Position", "Record"].map((each, i) => (
              <section
                key={i}
                className="cursor-pointer flex flex-col justify-start items-start"
              >
                <span
                  onClick={() => setBottomTab(each)}
                  className={`${i === 0 && "mr-[15px]"} mb-[8px] inline-block ${
                    each === bottomTab ? `text-theme_green` : `text-black`
                  }`}
                >
                  {each}
                </span>
                <div
                  className={`${
                    each === bottomTab ? `opacity-1` : `opacity-0`
                  } w-[45px] h-[3px] bg-theme_green`}
                ></div>
              </section>
            ))}
          </section>
        </section>
        <section className="w-full flex justify-center items-center">
          <section className="flex flex-col justify-start items-center">
            <figure className="w-[150px] h-[150px] relative">
              {/* <Image src="/assets/images/Nodate.svg" alt="Info image" fill /> */}
            </figure>
            {/* <span className="text-[#C0C4CC] font-[20px]">Empty</span> */}
          </section>
        </section>
      </section>
      <section className="w-full mt-[10px]">
        <h3 className="text-[16px] font-medium mb-[10px]">Pending Trades</h3>
        {trades.length > 0 ? (
          <div className="space-y-3">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="p-3 pt-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="text-[12px] text-gray-600 mr-2">
                    {new Date(trade.createdAt).toLocaleString()}
                  </span>
                  <figure className="w-[16px] h-[16px] relative">
                    {/* <Image src="/assets/icons/refresh.png" alt="Refresh icon" fill /> */}
                  </figure>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[12px] text-gray-600">
                    {trade.tradeType === "buy" ? `${trade.amount.toFixed(4)} ${trade.fromCurrency}` : `${trade.amount.toFixed(4)} ${trade.fromCurrency}`}
                  </span>
                  <span
                    className={`text-[12px] font-medium ${
                      trade.tradeType === "buy" ? "text-theme_green" : "text-theme_red"
                    }`}
                  >
                    {trade.tradeType.charAt(0).toUpperCase() + trade.tradeType.slice(1)}
                  </span>
                  <span className="text-[12px] text-gray-600">
                    {trade.tradeType === "sell" ? `${(trade.amount * trade.expectedPrice).toFixed(4)} ${trade.toCurrency}` : `${trade.amount.toFixed(4)} ${trade.toCurrency}`}
                  </span>
                </div>
                <span className="text-[12px] text-teal-500">
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-[12px]">No pending trades.</p>
        )}
      </section>
    </section>
  );
};

// Updated Contracts component
const Contracts = () => {
  const tabs = ["Spot", "Swap", "Seconds"];
  const [currentTab, setCurrentTab] = useState<
    "Spot" | "Swap" | "Seconds" | string
  >("Spot");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [currentToken, setCurrentToken] = useState<CryptoPrice>({
    c: 84355.0902,
    o: 0,
    h: 0,
    l: 0,
    v: 0,
    m: "BTC",
    bv: 0,
    ch: 0.0157,
    icon: "",
    channel: null,
    scode: null,
    lineChart: "",
    T: null,
    t: null,
  });

  useEffect(() => {
    fetch("https://actisexa.xyz/api/public/ticker")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCryptoPrices(data.result);
          setCurrentToken(data.result[0]);
        }
      })
      .catch((error) => console.error("Error fetching prices:", error));
  }, []);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[15px] pb-[70px] pt-[12px]">
      <PageHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tabs={tabs}
      />
      <Sidebar
        setCurrentToken={setCurrentToken}
        closeSidebar={closeSidebar}
        openSidebar={openSidebar}
        sidebarOpen={sidebarOpen}
        cryptoPrices={cryptoPrices}
      />
      {/* Updated token section with terminal button */}
      <section className="w-full flex  items-center my-[18px]">
        <section
          className="w-1/2 flex justify-start items-center cursor-pointer"
          onClick={() => openSidebar()}
        >
          <figure className="w-[20px] h-[20px] relative mr-[10px]">
            <Image src="/assets/icons/Sidebar-menu.png" alt="Menu icon" fill />
          </figure>
          <span>{currentToken.m}</span>
          <p
            className={`${
              currentToken.ch > 0 ? "text-theme_green" : "text-theme_red"
            } ml-[8px]`}
          >
            {currentToken.ch > 0 ? "+" : "-"}
            {Math.abs(currentToken.ch * 100).toFixed(2)}%
          </p>
        </section>
        <Link href={`/Contracts/${currentToken.m}USDT`}>
          <figure className="w-[20px] h-[20px] relative cursor-pointer ">
            <Image src="/assets/icons/terminal.svg" alt="Chart Terminal" width={100} height={50} />
          </figure>
        </Link>
      </section>
      {currentTab === "Spot" && <Spot marketPrice={currentToken.c} />}
      {currentTab === "Swap" && <Swap marketPrice={currentToken.c} />}
      {currentTab === "Seconds" && <Seconds marketPrice={currentToken.c} />}
      <Navbar />
    </main>
  );
};

export default Contracts;
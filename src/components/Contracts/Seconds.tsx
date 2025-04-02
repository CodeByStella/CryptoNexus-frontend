"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import PriceTable from "@/components/PriceTable/PriceTable";
import { useTrades } from "@/hooks/useTrade";
import { DropUp } from "./DropUp";
import { TradeList } from "./TradeList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { FaClock } from "react-icons/fa";

type SecondsProps = { marketPrice: number; coin: string; };

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const Seconds = ({ marketPrice, coin }: SecondsProps) => {
  const [dropUpOpen, setDropupOpen] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const steps = [0, 25, 50, 75, 100];
  const [amount, setAmount] = useState<number>(0);
  const [bottomTab, setBottomTab] = useState<string>("Position");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentTrade, setCurrentTrade] = useState<any>(null);
  const [timer, setTimer] = useState<number>(0);
  const [tradeStatus, setTradeStatus] = useState<"Running" | "Completed">("Running");
  const [tradeResult, setTradeResult] = useState<"Win" | "Loss" | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const { trades, fetchTrades } = useTrades();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef<string | null>(null);

  const deliveryOptions = useMemo(
    () => [
      { time: "30s", profit: 12, limit: { min: 100, max: 100000 } },
      { time: "60s", profit: 18, limit: { min: 10000, max: 1000000 } },
      { time: "90s", profit: 25, limit: { min: 60000, max: 1000000 } },
      { time: "180s", profit: 32, limit: { min: 150000, max: 1000000 } },
      { time: "300s", profit: 45, limit: { min: 300000, max: 1000000 } },
      { time: "30s", profit: 12, limit: { min: 100, max: 100000 } },
      { time: "60s", profit: 18, limit: { min: 10000, max: 1000000 } },
    ],
    []
  );

  const dropUpData: string[] = deliveryOptions.map((option) => option.time);
  const [selectedOption, setSelectedOption] = useState<string>(dropUpData[0]);

  const openDropup = useCallback(() => setDropupOpen(true), []);
  const closeDropUp = useCallback(() => setDropupOpen(false), []);

  const selectedProfit = useMemo(
    () => deliveryOptions.find((option) => option.time === selectedOption)?.profit || 6,
    [selectedOption, deliveryOptions]
  );

  const selectedLimit = useMemo(
    () =>
      deliveryOptions.find((option) => option.time === selectedOption)?.limit ||
      deliveryOptions[0].limit,
    [selectedOption, deliveryOptions]
  );

  const deliveryTimeSeconds = useMemo(
    () => parseInt(selectedOption.replace("s", "")),
    [selectedOption]
  );

  const defaultBalance = [
    { currency: "USDT", amount: 0 },
    { currency: "BTC", amount: 0 },
    { currency: "USDC", amount: 0 },
    { currency: "ETH", amount: 0 },
  ] as const;
  const userBalance = isLoggedIn?.balance?.length ? isLoggedIn.balance : defaultBalance;
  const usdtBalance = userBalance.find((bal) => bal.currency === "USDT")?.amount || 0;

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    const newAmount = (newValue / 100) * usdtBalance;
    setAmount(newAmount);
    setErrorMessage(null);
  }, [usdtBalance]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
    if (usdtBalance > 0) {
      const percentage = (newAmount / usdtBalance) * 100;
      setValue(Math.min(100, Math.max(0, percentage)));
    } else {
      setValue(0);
    }
    setErrorMessage(null);
  }, [usdtBalance]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setRequestIdAndRef = useCallback((id: string | null) => {
    setRequestId(id);
    requestIdRef.current = id;
  }, []);

  const handleTimeout = useCallback(async () => {
    if (!requestIdRef.current) {
      setErrorMessage("Trade request ID is missing.");
      setTradeStatus("Completed");
      setTradeResult("Loss");
      setProfit(null); // Don't set profit in error case
      setAmount(0);
      fetchTrades("completed", "Seconds");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token not found.");
        setTradeStatus("Completed");
        setTradeResult("Loss");
        setProfit(null); // Don't set profit in error case
        setAmount(0);
        fetchTrades("completed", "Seconds");
        setShowModal(false);
        setCurrentTrade(null);
        setRequestIdAndRef(null);
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/seconds/${requestIdRef.current}/timeout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response, "=====================> Response");

      setTradeStatus("Completed");
      if (response.data.status === "completed") {
        setTradeResult("Win");
        setProfit(response.data.profit); // Use profit directly from backend
      } else {
        setTradeResult("Loss");
        setProfit(response.data.profit); // Use profit directly from backend
      }
      setAmount(0);
      fetchTrades("completed", "Seconds");
    } catch (error: any) {
      setErrorMessage("Failed to process trade timeout.");
      setTradeStatus("Completed");
      setTradeResult("Loss");
      setProfit(null); // Don't set profit in error case
      setAmount(0);
      fetchTrades("completed", "Seconds");
    }
  }, [fetchTrades, setRequestIdAndRef]);

  const startTimer = useCallback(
    (duration: number) => {
      stopTimer();
      setTimer(duration);

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, duration - elapsed);
        setTimer(remaining);
        if (remaining <= 0) {
          stopTimer();
          handleTimeout();
        }
      }, 1000);
    },
    [stopTimer, handleTimeout]
  );

  const handleSubmit = useCallback(
    async (tradeType: "buy" | "sell") => {
      setErrorMessage(null);

      if (amount < selectedLimit.min || amount > selectedLimit.max) {
        setErrorMessage(`Amount must be between ${selectedLimit.min} and ${selectedLimit.max} USDT`);
        return;
      }
      if (usdtBalance < amount) {
        setErrorMessage("Not enough USDT balance");
        return;
      }
      if (amount <= 0) {
        setErrorMessage("Amount must be greater than 0");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please log in to continue.");
        return;
      }

      const requestBody = {
        seconds: deliveryTimeSeconds,
        amount,
        tradeType,
        fromCurrency: "USDT",
        toCurrency: coin,
        openPrice: marketPrice,
      };

      const tradeDate = new Date().toISOString().replace("T", " ").slice(0, 19);
      const tradeDetails = {
        tradeType,
        fromCurrency: "USDT",
        toCurrency: coin,
        amount: amount || 0,
        openPrice: marketPrice,
        deliveryPrice: marketPrice,
        tradeDate,
        deliveryTime: deliveryTimeSeconds,
      };

      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/request-seconds`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const requestIdFromServer = response.data.requestId;
        if (!requestIdFromServer || typeof requestIdFromServer !== "string" || requestIdFromServer.trim() === "") {
          throw new Error("Invalid requestId from server");
        }
        setRequestIdAndRef(requestIdFromServer);
        setCurrentTrade(tradeDetails);
        setShowModal(true);
        setTradeStatus("Running");
        setTradeResult(null);
        startTimer(deliveryTimeSeconds);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "Failed to submit trade.");
        setShowModal(false);
        setCurrentTrade(null);
        setRequestIdAndRef(null);
        setTradeStatus("Running");
        setTradeResult(null);
      }
    },
    [
      amount,
      selectedLimit.min,
      selectedLimit.max,
      usdtBalance,
      coin,
      marketPrice,
      deliveryTimeSeconds,
      setRequestIdAndRef,
      startTimer,
    ]
  );

  useEffect(() => {
    const status = bottomTab === "Position" ? "pending" : "completed";
    fetchTrades(status, "Seconds");
  }, [bottomTab, fetchTrades]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const closeModal = useCallback(() => {
    if (tradeStatus === "Running") {
      setErrorMessage("Please wait for the trade to complete.");
      return;
    }
    setShowModal(false);
    setCurrentTrade(null);
    setRequestIdAndRef(null);
    setTimer(0);
    setTradeStatus("Running");
    setTradeResult(null);
    setAmount(0);
    setValue(0);
    fetchTrades(bottomTab === "Position" ? "pending" : "completed", "Seconds");
    stopTimer();
  }, [
    tradeStatus,
    bottomTab,
    setRequestIdAndRef,
    fetchTrades,
    stopTimer,
  ]);

  const memoizedTrades = useMemo(() => trades, [trades]);

  const renderProfitDisplay = () => {
    if (tradeStatus === "Completed" && tradeResult && profit != null) {
      if (profit === 0) return null;
      return (
        <div className="flex justify-center mb-4">
          <span
            className={`text-[30px] font-medium ${tradeResult === "Win" ? "text-theme_green" : "text-theme_red"
              }`}
          >
            {tradeResult === "Win" ? "+" : ""}
            {profit.toFixed(2)} USDT
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="w-full flex flex-col justify-start items-center relative pb-[100px]">
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
              className="w-[50%] rounded-[5px] p-[5px] flex justify-between items-center bg-[#F5F7FA] cursor-pointer"
            >
              <span>{selectedOption}</span>
              <div className="v-icon">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 8.5L2 4.5H10L6 8.5Z" fill="#8A8A8A" />
                </svg>
              </div>
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
              <span className="text-[silver] text-[12px] font-light">(*{selectedProfit}%)</span>
            </section>
            <section className="my-[7px] w-full rounded-[5px] p-[7px] flex justify-between items-center bg-[#F5F7FA]">
              <section className="flex justify-start items-center">
                <figure className="relative w-[20px] h-[20px] mr-[8px]">
                  <Image src="/assets/images/Down.svg" alt="Down image" fill />
                </figure>
                <span className="text-theme_red text-[12px]">Down ≥ 0.15%</span>
              </section>
              <span className="text-[silver] text-[12px] font-light">(*{selectedProfit}%)</span>
            </section>
            <span className="text-[11px] mb-[7px]">
              Limit: <span className="font-light text-theme_green">{selectedLimit.min}-{selectedLimit.max}</span>
            </span>
          </section>
          <div className="w-full mb-[7px] rounded-[5px] py-[8px] px-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span className="text-[#C0C4CC] text-[17px]">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-[60px] border border-gray-300 rounded p-1 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
          {errorMessage && (
            <div className="w-full text-[12px] text-theme_red mb-[5px]">{errorMessage}</div>
          )}
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
                onChange={handleSliderChange}
                className="w-full appearance-none bg-transparent cursor-pointer"
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
                  width: 17px;
                  height: 17px;
                  background-color: #22A2B3;
                  border-radius: 50%;
                  cursor: pointer;
                  z-index: 10;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 17px;
                  height: 17px;
                  background-color: #22A2B3;
                  border-radius: 50%;
                  cursor: pointer;
                }
              `}
            </style>
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Balance</span>
            <span>{usdtBalance.toFixed(2)} USDT</span>
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Expected Profit</span>
            <span>{(amount * (selectedProfit / 100)).toFixed(2)} USDT</span>
          </div>
          <button
            className="cursor-pointer w-full h-[45px] text-white rounded-[3px] mt-[7px] bg-theme_green flex items-center justify-end"
            onClick={() => handleSubmit("buy")}
          >
            <section className="w-[60%] flex justify-between items-center">
              <span>Long</span>
              <span className="text-[12px] opacity-[.6] mr-[9px]">Up</span>
            </section>
          </button>
          <button
            className="cursor-pointer w-full h-[45px] text-white rounded-[3px] mt-[10px] bg-theme_red flex items-center justify-end"
            onClick={() => handleSubmit("sell")}
          >
            <section className="w-[60%] flex justify-between items-center">
              <span>Short</span>
              <span className="text-[12px] opacity-[.6] mr-[9px]">Down</span>
            </section>
          </button>
        </section>
        <section className="w-[48%]">
          <PriceTable marketPrice={marketPrice} swap={false} coin={coin} />
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
                  className={`${i === 0 && "mr-[15px]"} mb-[8px] inline-block ${each === bottomTab ? `text-theme_green` : `text-black`
                    }`}
                >
                  {each}
                </span>
                <div
                  className={`${each === bottomTab ? `opacity-1` : `opacity-0`
                    } w-[45px] h-[3px] bg-theme_green`}
                ></div>
              </section>
            ))}
          </section>
        </section>
        {bottomTab === "Position" ? (
          <TradeList
            trades={memoizedTrades}
            filter="pending"
            title="Pending Trades"
            coin={coin}
            tradeMode="Seconds"
          />
        ) : (
          <TradeList
            trades={memoizedTrades}
            filter="completed"
            title="Trade Records"
            coin={coin}
            tradeMode="Seconds"
          />
        )}
      </section>

      {showModal && currentTrade && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[300px]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[14px] font-medium">{coin} Contracts</h3>
              <button onClick={closeModal} className="text-gray-500">✕</button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] text-gray-600">{currentTrade.tradeDate}</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-1" />
                  <span className="text-[12px] text-blue-500">
                    {tradeStatus === "Running" ? timer : currentTrade.deliveryTime}
                  </span>
                </div>
                {tradeStatus === "Running" ? (
                  <div className="flex items-center">
                    <span className="text-[12px] text-blue-500 mr-1">Running</span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                ) : (
                  tradeResult && (
                    <div className="flex items-center">
                      <span className={`text-[12px] ${tradeResult === "Win" ? "text-theme_green" : "text-theme_red"}`}>
                        {tradeResult}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            {tradeStatus === "Running" ? (
              <div className="flex justify-center mb-4">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      fill="none"
                      strokeWidth="3"
                      stroke="currentColor"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      fill="none"
                      strokeWidth="3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeDasharray={`${(timer / (currentTrade?.deliveryTime || 1)) * 100}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[12px] font-medium">
                    {timer}s
                  </div>
                </div>
              </div>
            ) : (
              renderProfitDisplay()
            )}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px]">{currentTrade.amount} USDT</span>
              <div className="flex items-center">
                <figure className="relative w-[16px] h-[16px] mr-1">
                  <Image
                    src={
                      currentTrade.tradeType === "buy"
                        ? "/assets/images/Up.svg"
                        : "/assets/images/Down.svg"
                    }
                    alt={currentTrade.tradeType === "buy" ? "Up image" : "Down image"}
                    fill
                  />
                </figure>
                <span
                  className={`text-[12px] ${currentTrade.tradeType === "buy" ? "text-theme_green" : "text-theme_red"
                    }`}
                >
                  {currentTrade.tradeType === "buy" ? "↑ Up" : "↓ Down"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] text-gray-600">Open: {currentTrade.openPrice.toFixed(4)}</span>
              <span className="text-[12px] text-gray-600">Delivery: {(currentTrade.deliveryPrice + (tradeResult === "Win" ? profit : -(profit || 0))).toFixed(3)}</span>
            </div>
            {tradeStatus === "Completed" && (
              <button
                className="w-full mt-4 py-2 text-white bg-theme_green rounded text-[12px]"
                onClick={closeModal}
              >
                Create a new order
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
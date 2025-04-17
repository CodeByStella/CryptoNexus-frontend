import { useState, useEffect } from "react";
import PriceTable from "@/components/PriceTable/PriceTable";
import { useTrades } from "@/hooks/useTrade";
import { DropUp } from "./DropUp";
import { TradeList } from "./TradeList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type SwapProps = { marketPrice: number; coin: string };

export const Swap = ({ marketPrice, coin }: SwapProps) => {
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [dropUpOpen, setDropupOpen] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const steps = [0, 25, 50, 75, 100];
  const [amount, setAmount] = useState<number>(0);
  const [bottomTab, setBottomTab] = useState<string>("Position");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { trades, submitTrade } = useTrades();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  const [leverage, setLeverage] = useState<number>(10);
  const leverageOptions = [10, 20, 30, 40, 50];

  const defaultBalance = [
    { currency: "USDT", amount: 0 },
    { currency: "BTC", amount: 0 },
    { currency: "USDC", amount: 0 },
    { currency: "ETH", amount: 0 },
  ] as const;

  const userBalance = isLoggedIn?.balance?.length ? isLoggedIn.balance : defaultBalance;
  const usdtBalance = userBalance.find((bal) => bal.currency === "USDT")?.amount || 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    const newAmount = (newValue / 100) * usdtBalance;
    setAmount(newAmount);
    setErrorMessage(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
    if (usdtBalance > 0) {
      const percentage = (newAmount / usdtBalance) * 100;
      setValue(Math.min(100, Math.max(0, percentage)));
    } else {
      setValue(0);
    }
    setErrorMessage(null);
  };

  const coinAmount = amount && marketPrice ? (amount / marketPrice).toFixed(4) : "0.0000";

  const estimatedProfit = () => {
    const priceChange = marketPrice * 0.01;
    const positionValue = parseFloat(coinAmount) * marketPrice;
    const leveragedValue = positionValue * leverage;
    const profit =
      tradeAction === "buy" ? leveragedValue * 0.01 : leveragedValue * -0.01;
    return profit.toFixed(2);
  };


  const handleSubmit = () => {
    setErrorMessage(null);
    if (usdtBalance < amount) {
      setErrorMessage("Not enough balance");
      return;
    }
    if (amount <= 0) {
      setErrorMessage("Amount must be greater than 0");
      return;
    }
    const newTrade = {
      tradeType: tradeAction,
      fromCurrency: tradeAction === "buy" ? "USDT" : coin,
      toCurrency: tradeAction === "buy" ? coin : "USDT",
      amount: amount || 0, // Include 'amount' as required by the Trade type
      principalAmount: amount || 0, // Include 'principalAmount' as required by the Trade type
      profitAmount: 0, // Include 'profitAmount' as required by the Trade type
      expectedPrice: marketPrice,
      tradeMode: "Swap" as const,
      status: "pending" as const,
    };
    submitTrade(newTrade, setAmount);
  };
  const openDropup = () => setDropupOpen(true);
  const closeDropUp = () => setDropupOpen(false);

  return (
    <section className="w-full flex flex-col justify-start items-center pb-[90px] relative">
      <DropUp
        data={leverageOptions}
        setSelectedOption={setLeverage}
        closeDropUp={closeDropUp}
        dropUpOpen={dropUpOpen}
      />
      <section className="w-full flex justify-between items-start mb-[20px]">
        <section className="w-[48%] flex flex-col justify-start items-center">
          <button className="w-full h-[32px] font-bold text-[12px] text-white rounded-[4px] bg-theme_green">
            Open
          </button>
          <div className="w-full mt-[9px] rounded-[5px] p-[10px] flex justify-center text-[14px] bg-[#F5F7FA]">
            Market Price
          </div>
          <div className="w-full my-[9px] rounded-[5px] p-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
            <span>{marketPrice.toFixed(2)}</span>
            <span className="text-[#8A8A8A]">USDT</span>
          </div>
          <div className="w-full mb-[7px] rounded-[5px] p-[10px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
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
            <div className="w-full text-[12px] text-theme_red mb-[5px]">
              {errorMessage}
            </div>
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
                  background-color: #0052FF;
                  border-radius: 50%;
                  cursor: pointer;
                  z-index: 10;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 17px;
                  height: 17px;
                  background-color: #0052FF;
                  border-radius: 50%;
                  cursor: pointer;
                }
              `}
            </style>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Pay</span>
            <span>{amount ? amount.toFixed(2) : "0"} USDT</span>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Amount</span>
            <span>{coinAmount} {coin}</span>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Available</span>
            <span>{usdtBalance.toFixed(2)} USDT</span>
          </div>
          <div className="w-full my-[3px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Est. Profit (1% Move)</span>
            <span>{estimatedProfit()} USDT</span>
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
          <PriceTable
            marketPrice={marketPrice}
            swap={true}
            openList={openDropup}
            coin={coin}
          />
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
        {bottomTab === "Position" ? (
          <TradeList
            trades={trades}
            filter="pending"
            title="Pending Trades"
            coin={coin}
            tradeMode="Swap" // Pass tradeMode
          />
        ) : (
          <TradeList
            trades={trades}
            filter="completed"
            title="Trade Records"
            coin={coin}
            tradeMode="Swap" // Pass tradeMode
          />
        )}
      </section>
    </section>
  );
};
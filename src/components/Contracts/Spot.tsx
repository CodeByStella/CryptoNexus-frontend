import { useState, useEffect } from "react";
import PriceTable from "@/components/PriceTable/PriceTable";
import { useTrades } from "@/hooks/useTrade";
import { TradeList } from "./TradeList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type SpotProps = { marketPrice: number; coin: string };

export const Spot = ({ marketPrice, coin }: SpotProps) => {
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [value, setValue] = useState(0);
  const steps = [0, 25, 50, 75, 100];
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bottomTab, setBottomTab] = useState<string>("Position"); // Add Position/Record tabs
  const { trades, submitTrade } = useTrades();
  const [loadingPrices, setLoadingPrices] = useState(true);
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    USDT: 1,
    BTC: 0,
    USDC: 0,
    ETH: 0,
  });

  const defaultBalance = [
    { currency: "USDT", amount: 0 },
    { currency: "BTC", amount: 0 },
    { currency: "USDC", amount: 0 },
    { currency: "ETH", amount: 0 },
  ] as const;
  const userBalance = isLoggedIn?.balance?.length ? isLoggedIn.balance : defaultBalance;
  const totalUSDT = userBalance.reduce((sum, bal) => {
    return sum + (bal.amount * (prices[bal.currency] || 0));
  }, 0);

  // Handle slider change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    const newAmount = (newValue / 100) * totalUSDT;
    setAmount(newAmount);
    setErrorMessage(null);
  };

  // Handle direct amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
    if (totalUSDT > 0) {
      const percentage = (newAmount / totalUSDT) * 100;
      setValue(Math.min(100, Math.max(0, percentage)));
    } else {
      setValue(0);
    }
    setErrorMessage(null);
  };

  // Update the progress bar value based on the amount
  useEffect(() => {
    if (totalUSDT > 0) {
      const percentage = (amount / totalUSDT) * 100;
      setValue(Math.min(100, Math.max(0, percentage)));
    } else {
      setValue(0);
    }
  }, [amount, totalUSDT]);

  const handleSubmit = () => {
    setErrorMessage(null);
    if (totalUSDT < amount) {
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
      amount: amount || 0,
      expectedPrice: marketPrice,
      tradeMode: "Spot" as const, // Add tradeMode
    };
    submitTrade(newTrade, setAmount);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,usd-coin,ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setPrices({
          USDT: data.tether.usd,
          BTC: data.bitcoin.usd,
          USDC: data["usd-coin"].usd,
          ETH: data.ethereum.usd,
        });
        setLoadingPrices(false);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
        setLoadingPrices(false);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col justify-start items-center pb-[90px]">
      <section className="w-full flex justify-between items-start mb-[20px]">
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
            <span className="text-[#8A8A8A]">Pay</span>
            <span>{amount ? amount.toFixed(2) : "0"} USDT</span>
          </div>
          <div className="w-full my-[5px] flex justify-between items-center text-[12px]">
            <span className="text-[#8A8A8A]">Available</span>
            <span>{totalUSDT.toFixed(2)} USDT</span>
          </div>
          <button
            className={`w-full h-[45px] text-white rounded-[3px] mt-[7px] ${
              tradeAction === "buy" ? "bg-theme_green" : "bg-theme_red"
            }`}
            onClick={handleSubmit}
          >
            {tradeAction === "buy" ? "Buy" : "Sell"}
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
            tradeMode="Spot" // Pass tradeMode
          />
        ) : (
          <TradeList
            trades={trades}
            filter="completed"
            title="Trade Records"
            coin={coin}
            tradeMode="Spot" // Pass tradeMode
          />
        )}
      </section>
    </section>
  );
};
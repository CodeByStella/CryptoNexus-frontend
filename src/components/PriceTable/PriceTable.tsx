import Image from "next/image";
import React, { useEffect, useState } from "react";

const PriceTable = ({
  swap,
  openList,
  marketPrice,
  coin = "BTC", // Add coin prop to know which coin is selected
}: {
  swap?: boolean;
  openList?: () => void;
  marketPrice: number;
  coin?: string; // e.g., "BTC", "ETH", "USDC"
}) => {
  const [bidPrices, setBidPrices] = useState<{ usdt: number; amount: number }[]>([]);
  const [askPrices, setAskPrices] = useState<{ usdt: number; amount: number }[]>([]);
  const [midPrice, setMidPrice] = useState<number>(marketPrice || 0);

  useEffect(() => {
    let basePrice = marketPrice > 0 ? marketPrice : 84125.7924; // Fallback to BTC price if marketPrice is 0
    setMidPrice(basePrice);

    // Adjust price step and base amount based on the coin's price magnitude
    let priceStep: number;
    let baseAmount: number;

    if (basePrice > 10000) {
      // High-value coins like BTC (e.g., $84,125)
      priceStep = 0.005; // 0.5% step
      baseAmount = 0.05; // Smaller amounts for high-value coins
    } else if (basePrice > 100) {
      // Mid-value coins like ETH (e.g., $2,500)
      priceStep = 0.01; // 1% step
      baseAmount = 1; // Larger amounts for mid-value coins
    } else {
      // Low-value coins like USDC (e.g., $1)
      priceStep = 0.02; // 2% step
      baseAmount = 100; // Much larger amounts for low-value coins
    }

    // Bids (below market price)
    const bids = Array(5)
      .fill(0)
      .map((_, i) => {
        const price = basePrice - (i + 1) * priceStep * basePrice;
        const amount = baseAmount + Math.random() * (baseAmount * 0.5); // Random variation
        return { usdt: price, amount };
      });

    // Asks (above market price)
    const asks = Array(5)
      .fill(0)
      .map((_, i) => {
        const price = basePrice + (i + 1) * priceStep * basePrice;
        const amount = baseAmount + Math.random() * (baseAmount * 0.5); // Random variation
        return { usdt: price, amount };
      });

    setBidPrices(bids);
    setAskPrices(asks);
  }, [marketPrice]);

  return (
    <section className="w-full flex flex-col justify-start items-center">
      {swap && (
        <section className="w-full flex justify-end items-center">
          <section
            onClick={openList}
            className="cursor-pointer mb-[17px] flex justify-end items-center border border-theme_green rounded-[2px] h-[27px]"
          >
            <span className="mr-[3px] font-light text-[14px]">Lever</span>
            <figure className="w-[14px] h-[16px] relative">
              <Image src={"/assets/icons/Lever.svg"} alt="Lever icon" fill />
            </figure>
          </section>
        </section>
      )}

      <section className="w-full flex justify-between items-center text-[12px]">
        <span>Price</span>
        <span>Amount</span>
      </section>

      <section className="w-full flex justify-between items-center text-[12px] mb-[2px] text-[silver]">
        <span>USDT</span>
        <span>({coin})</span> {/* Dynamically show the coin symbol */}
      </section>

      <section className="w-full flex flex-col justify-start items-center">
        <section className="w-full flex flex-col justify-start items-center">
          {askPrices.map((entry, i) => (
            <section
              key={i}
              className="w-full flex justify-between items-center text-[13px]"
            >
              <span className="text-[#11CFBC]">{entry.usdt.toFixed(4)}</span>
              <span className="bg-[#ECFFFE] py-[4px] font-light">
                {entry.amount.toFixed(4)}
              </span>
            </section>
          ))}
        </section>

        <span className="w-full my-[18px] text-center text-theme_red font-medium">
          {midPrice ? midPrice.toFixed(4) : "0.0000"}
        </span>

        <section className="w-full flex flex-col justify-start items-center">
          {bidPrices.map((entry, i) => (
            <section
              key={i}
              className="w-full flex justify-between items-center text-[13px]"
            >
              <span className="text-theme_red">{entry.usdt.toFixed(4)}</span>
              <span className="bg-[#FFF2F2] py-[4px] font-light">
                {entry.amount.toFixed(4)}
              </span>
            </section>
          ))}
        </section>
      </section>
    </section>
  );
};

export default PriceTable;
"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { useMarketData } from "@/hooks/useMarketData";
import { PageHeader } from "@/components/Contracts/PageHeader";
import { Sidebar } from "@/components/Contracts/SideBar";
import { Spot } from "@/components/Contracts/Spot";
import { Swap } from "@/components/Contracts/Swap";
import { Seconds } from "@/components/Contracts/Seconds";

const Contracts = () => {
  const tabs = ["Spot", "Swap", "Seconds"];
  const [currentTab, setCurrentTab] = useState<"Spot" | "Swap" | "Seconds" | string>("Spot");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { marketTickers, currentTicker, setCurrentTicker } = useMarketData();

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const changePercentage = currentTicker?.ch;
  const marketPrice = currentTicker?.c || 0;
  const coin = currentTicker?.m || "BTC"; // Pass the coin symbol

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[15px] pb-[70px] pt-[12px]">
      <PageHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tabs={tabs}
      />
      <Sidebar
        setCurrentTicker={setCurrentTicker}
        closeSidebar={closeSidebar}
        openSidebar={openSidebar}
        sidebarOpen={sidebarOpen}
        marketTickers={marketTickers}
      />
      <section className="w-full flex items-center my-[18px]">
        <section
          className="w-1/2 flex justify-start items-center cursor-pointer"
          onClick={openSidebar}
        >
          <figure className="w-[20px] h-[20px] relative mr-[10px]">
            <Image src="/assets/icons/Sidebar-menu.png" alt="Menu icon" fill />
          </figure>
          <span>{coin}</span> {/* Display the selected coin */}
          <p
            className={`${
              changePercentage !== undefined && changePercentage > 0
                ? "text-theme_green"
                : "text-theme_red"
            } ml-[8px]`}
          >
            {changePercentage !== undefined && changePercentage > 0 ? "+" : "-"}
            {changePercentage !== undefined ? Math.abs(changePercentage * 100).toFixed(2) : "0.00"}%
          </p>
        </section>
        <Link href={`/Contracts/${coin}USDT`}>
          <figure className="w-[20px] h-[20px] relative cursor-pointer">
            <Image src="/assets/icons/terminal.svg" alt="Chart Terminal" width={100} height={50} />
          </figure>
        </Link>
      </section>
      {currentTab === "Spot" && <Spot marketPrice={marketPrice} coin={coin} />}
      {currentTab === "Swap" && <Swap marketPrice={marketPrice} coin={coin} />}
      {currentTab === "Seconds" && <Seconds marketPrice={marketPrice} coin={coin} />}
      <Navbar />
    </main>
  );
};

export default Contracts;
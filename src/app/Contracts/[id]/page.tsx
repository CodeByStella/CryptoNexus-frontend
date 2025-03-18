// app/Contracts/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TradePairChart = () => {
  const params = useParams();
  const tradePair = params?.id as string; // Matches [id] folder
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptAdded = useRef(false); // Prevent duplicate scripts

  useEffect(() => {
    console.log("TradePairChart mounted, tradePair:", tradePair);

    if (!tradePair || !chartContainerRef.current) {
      console.log("Missing tradePair or container, skipping...");
      return;
    }

    if (scriptAdded.current) {
      console.log("Script already added, skipping...");
      return;
    }

    console.log("Adding TradingView script for", tradePair);
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${tradePair}`, // e.g., "BINANCE:BTCUSDT"
      interval: "1H", // 1-hour candlesticks
      timezone: "Etc/UTC",
      theme: "light",
      style: "1", // Candlesticks like Binance
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: false,
      support_host: "https://www.tradingview.com",
    });

    script.onload = () => {
      console.log("TradingView script loaded successfully");
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load TradingView script");
      setError("Failed to load chart. Check your network or trade pair.");
    };

    chartContainerRef.current.appendChild(script);
    scriptAdded.current = true;

    return () => {
      console.log("Component unmounting, no cleanup needed");
    };
  }, [tradePair]);

  if (!tradePair) {
    return <p>No trade pair specified</p>;
  }

  return (
    <main className="font-[Inter] w-screen h-screen flex justify-center items-center bg-white p-0 m-0 overflow-hidden">
      <div
        ref={chartContainerRef}
        className="tradingview-widget-container"
        style={{ height: "100%", width: "100%" }}
      >
        {!isLoaded && !error && (
          <div className="flex justify-center items-center h-full">
            <p>Loading chart...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-full text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default TradePairChart;
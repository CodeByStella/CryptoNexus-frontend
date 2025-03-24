import { useState, useEffect } from "react";
import marketDataService from "@/services/binanceSocket";
import { MarketTicker } from "@/types";

export const useMarketData = () => {
  const [marketTickers, setMarketTickers] = useState<MarketTicker[]>([]);
  const [currentTicker, setCurrentTicker] = useState<MarketTicker | null>(null);

  useEffect(() => {
    const handleTickerUpdate = (data: MarketTicker) => {
      setMarketTickers((prev) => {
        const index = prev.findIndex((p) => p.m === data.m);
        if (index !== -1) {
          const newTickers = [...prev];
          newTickers[index] = { ...newTickers[index], ...data };
          return newTickers;
        }
        return [...prev, data];
      });

      setCurrentTicker((prev) =>
        prev && prev.m === data.m ? { ...prev, ...data } : prev
      );
    };

    marketDataService.subscribe(handleTickerUpdate);
    marketDataService.startFetching();

    return () => {
      marketDataService.unsubscribe(handleTickerUpdate);
      marketDataService.stopFetching();
    };
  }, []);

  useEffect(() => {
    if (!currentTicker && marketTickers.length > 0) {
      setCurrentTicker(marketTickers[0]);
    }
  }, [marketTickers, currentTicker]);

  return { marketTickers, currentTicker, setCurrentTicker };
};
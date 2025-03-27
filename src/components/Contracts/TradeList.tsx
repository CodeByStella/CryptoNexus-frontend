import { Trade } from "@/types";

type TradeListProps = {
  trades: Trade[];
  filter: "pending" | "completed";
  title: string;
  coin: string;
  tradeMode: "Swap" | "Spot" | "Seconds";
};

export const TradeList = ({ trades, filter, title, coin, tradeMode }: TradeListProps) => {
  // Safely filter and sort trades
  const filteredTrades = trades
    .filter((trade) => trade?.tradeMode === tradeMode)
    .filter((trade) => trade?.toCurrency === coin)
    .filter((trade) => {
      if (!trade?.status) return false;
      return filter === "pending"
        ? trade.status === "pending"
        : trade.status === "completed" || trade.status === "cancelled";
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <section className="w-full mt-[10px]">
      <h3 className="text-[16px] font-medium mb-[10px]">{title}</h3>
      
      {filteredTrades.length > 0 ? (
        <div className="space-y-3">
          {filteredTrades.map((trade) => {
            // Safely calculate values with fallbacks
            const principalAmount = trade?.principalAmount ?? 0;
            const profitAmount = trade?.profitAmount ?? 0;
            const expectedPrice = trade?.expectedPrice ?? 1; // Avoid division by zero
            
            return (
              <div
                key={trade.id}
                className="p-3 pt-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="text-[12px] text-gray-600 mr-2">
                    {trade?.createdAt ? new Date(trade.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }).replace(/\//g, "-") : '--'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Principal Amount */}
                  <span className="text-[12px] text-gray-600">
                    {trade?.fromCurrency || '--'} {principalAmount.toFixed(4)}
                  </span>
                  
                  {/* Trade Direction */}
                  <span
                    className={`text-[12px] font-medium ${
                      trade?.tradeType === "buy" ? "text-theme_green" : "text-theme_red"
                    }`}
                  >
                    {trade?.tradeType === "buy" ? "Long" : "Short"}
                  </span>
                  
                  {/* Calculated Amount */}
                  <span className="text-[12px] text-gray-600">
                    {trade?.toCurrency || '--'} {(principalAmount / expectedPrice).toFixed(4)}
                  </span>
                  
                  {/* Profit/Loss Display */}
                  {trade?.status === "completed" && (
                    <span
                      className={`text-[12px] ${
                        profitAmount >= 0 ? "text-theme_green" : "text-theme_red"
                      }`}
                    >
                      {profitAmount >= 0 ? "+" : ""}
                      {profitAmount.toFixed(2)} USDT
                    </span>
                  )}
                </div>
                
                {/* Status */}
                <span className="text-[12px] text-teal-500">
                  {trade?.status ? (
                    trade.status.charAt(0).toUpperCase() + trade.status.slice(1)
                  ) : '--'}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-[12px]">
          No {filter === "pending" ? "pending trades" : "trade records"}.
        </p>
      )}
    </section>
  );
};
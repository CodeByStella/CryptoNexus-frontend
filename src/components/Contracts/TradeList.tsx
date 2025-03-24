import { Trade } from "@/types";

type TradeListProps = {
  trades: Trade[];
  filter: "pending" | "completed";
  title: string;
  coin: string;
  tradeMode: "Swap" | "Spot" | "Seconds"; // Add tradeMode prop
};

export const TradeList = ({ trades, filter, title, coin, tradeMode }: TradeListProps) => {
  // Filter trades by tradeMode first
  const modeFilteredTrades = trades.filter((trade) => trade.tradeMode === tradeMode);

  // Then filter by status (pending or completed/cancelled)
  const filteredTrades = modeFilteredTrades.filter((trade) =>
    filter === "pending"
      ? trade.status === "pending"
      : trade.status === "completed" || trade.status === "cancelled"
  );

  return (
    <section className="w-full mt-[10px]">
      <h3 className="text-[16px] font-medium mb-[10px]">{title}</h3>
      {filteredTrades.length > 0 ? (
        <div className="space-y-3">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="p-3 pt-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center">
                <span className="text-[12px] text-gray-600 mr-2">
                  {new Date(trade.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }).replace(/\//g, "-")}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[12px] text-gray-600">
                  {trade.fromCurrency} {trade.amount.toFixed(4)}
                </span>
                <span
                  className={`text-[12px] font-medium ${
                    trade.tradeType === "buy" ? "text-theme_green" : "text-theme_red"
                  }`}
                >
                  {trade.tradeType === "buy" ? "Long" : "Short"}
                </span>
                <span className="text-[12px] text-gray-600">
                  {trade.toCurrency} {(trade.amount / trade.expectedPrice).toFixed(4)}
                </span>
                {trade.status === "completed" && trade.profit !== undefined && (
                  <span
                    className={`text-[12px] ${
                      trade.profit >= 0 ? "text-theme_green" : "text-theme_red"
                    }`}
                  >
                    {trade.profit >= 0 ? "+" : ""}
                    {trade.profit.toFixed(2)} USDT
                  </span>
                )}
              </div>
              <span className="text-[12px] text-teal-500">
                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-[12px]">
          No {filter === "pending" ? "pending trades" : "trade records"}.
        </p>
      )}
    </section>
  );
};
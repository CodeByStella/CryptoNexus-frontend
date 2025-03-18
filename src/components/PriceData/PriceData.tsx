import {
  PriceDataItem,
  featuredTokenType,
} from "@/types/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import marketDataService from "@/services/binanceSocket";

type PriceListProps = {
  data: PriceDataItem[];
};

const PriceList = ({ data }: PriceListProps) => {
  return (
    <section className="w-full flex flex-col justify-start items-center">
      {data.map((each, i) => {
        return (
          <section
            key={i}
            className="w-full flex justify-between items-center py-[10px] price-list"
          >
            <section className="w-[50%] flex justify-start items-center">
              <figure className="w-[28px] h-[28px] mr-[8px] relative rounded-[50px]">
                <Image
                  src={each.icon}
                  alt={`Icon for ${each.ticker}`}
                  fill
                  className="rounded-[inherit]"
                />
              </figure>
              <span>{each.ticker}</span>
            </section>
            <section className="w-[24%] flex justify-end">
              {each.value.toFixed(4)}
            </section>
            <section className="w-[20%] flex justify-end">
              <div
                className={`rounded-[8px] flex justify-center text-white py-[7px] w-[150px] ${
                  each.changeDirection === "High" ? "bg-green-700" : "bg-red-700"
                }`}
              >
                {each.changeDirection === "High" ? "+" : "-"}
                {each.changeRate}
                {"%"}
              </div>
            </section>
          </section>
        );
      })}
    </section>
  );
};

type PriceDataProps = {
  marketPage?: boolean;
};

type CategoryType = "Precious metals" | "Digital currency" | "Forex" | "Index" | "Futures";

const PriceData = ({ marketPage = false }: PriceDataProps) => {
  const [dataToRender, setDataToRender] = useState<PriceDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const categories: CategoryType[] = [
    "Precious metals",
    "Digital currency",
    "Forex", 
    "Index",
    "Futures",
  ];

  const [currentCategory, setCurrentCategory] = useState<CategoryType>("Digital currency");

  useEffect(() => {
    setIsLoading(true);
    setDataToRender([]);

    const fetchData = () => {
      marketDataService.fetchMarketData(currentCategory, (updatedData) => {
        setDataToRender(updatedData);
        setIsLoading(false);
      });
    };

    fetchData(); 
    const intervalId = setInterval(fetchData, 5000); 

    return () => clearInterval(intervalId); 
  }, [currentCategory]);

  return (
    <section className="w-full flex flex-col justify-start items-center pb-[20px]">
      <section className="mt-[20px] w-full flex flex-col justify-start items-center overflow-x-hidden">
        <section className="mb-[15px] w-full overflow-x-scroll hide-scrollbar flex items-center whitespace-nowrap">
          {categories.map((each, i) => (
            <span
              key={i}
              className={`px-[12px] mx-[8px] py-[4px] rounded-[20px] whitespace-nowrap cursor-pointer ${
                each === currentCategory
                  ? "bg-[#D2EEFF] text-[#2664FA]"
                  : "bg-[#F3F3F3] text-[#606266]"
              }`}
              onClick={() => setCurrentCategory(each)}
            >
              {each}
            </span>
          ))}
        </section>

        {marketPage && (
          <section className="w-full flex justify-between items-center text-[silver]">
            <span className="w-[50%] text-left">Market</span>
            <span className="w-[24%] text-right">Price</span>
            <span className="w-[20%] text-right">Change</span>
          </section>
        )}

        {isLoading ? (
          <div className="w-full text-center py-4">Loading price data...</div>
        ) : (
          <PriceList data={dataToRender} />
        )}
      </section>
    </section>
  );
};

export default PriceData;

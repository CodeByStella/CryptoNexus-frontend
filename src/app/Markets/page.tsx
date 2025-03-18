"use client"

import Navbar from "@/components/Navbar/Navbar";
import PriceData from "@/components/PriceData/PriceData";
import { useState } from "react";

const Markets = () => {


  const categories: string[] = [
    "Precious metals",
    "Digital currency",
    "Forex",
    "Index",
    "Futures",
  ];

    const [currentCategory, setCurrentCategory] = useState<string>(categories[0]);
  

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[12px] pb-[70px] pt-[12px]">

      <h1 className="w-full text-left text-[20px]">Market</h1>

      

        <PriceData marketPage={true}/>

      <Navbar/>
    </main>
  );
};

export default Markets;

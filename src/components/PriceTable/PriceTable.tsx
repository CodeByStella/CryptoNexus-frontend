import Image from "next/image";
import React from "react";

const PriceTable = ({
  swap,
  openList,
}: {
  swap?: Boolean;
  openList?: () => void;
}) => {
  return (
    <section className="w-full flex flex-col justify-start items-center">
      {swap && (
        <section className="w-full flex justify-end items-center">
          {/* Lever */}
          <section onClick={openList}  className="cursor-pointer mb-[17px] flex justify-end items-center border border-theme_green rounded-[2px] h-[27px]">
            <span className="mr-[3px] font-light text-[14px]">Lever</span>
            <figure className="w-[14px] h-[16px] relative">
              <Image src={"/assets/icons/Lever.svg"} alt="Lever icon" fill />
            </figure>
          </section>
        </section>
      )}

      {/* Header */}
      <section className="w-full flex justify-between items-center text-[12px] ">
        <span>Price</span>
        <span>Amount</span>
      </section>

      {/* Header 2 */}
      <section className="w-full flex justify-between items-center text-[12px] mb-[2px] text-[silver]">
        <span>USDT</span>
        <span>(BTC)</span>
      </section>

      {/* TableView */}
      <section className="w-full flex flex-col justify-start items-center">
        {/* Top */}
        <section className="w-full flex flex-col justify-start items-center">
          {Array(5)
            .fill(0)
            .map((e, i) => {
              return (
                <section
                  key={i}
                  className="w-full flex justify-between items-center text-[13px]"
                >
                  <span className="text-[#11CFBC]">104.6986</span>
                  <span className="bg-[#ECFFFE] py-[4px] font-light">
                    115.9897
                  </span>
                </section>
              );
            })}
        </section>

        {/* Mid */}
        <span className="w-full my-[18px] text-center text-theme_red font-medium">
          104.1863
        </span>

        {/* Bottom */}
        <section className="w-full flex flex-col justify-start items-center">
          {Array(5)
            .fill(0)
            .map((e, i) => {
              return (
                <section
                  key={i}
                  className="w-full flex justify-between items-center text-[13px]"
                >
                  <span className="text-theme_red">104.6986</span>
                  <span className="bg-[#FFF2F2] py-[4px] font-light">
                    115.9897
                  </span>
                </section>
              );
            })}
        </section>
      </section>
    </section>
  );
};

export default PriceTable;

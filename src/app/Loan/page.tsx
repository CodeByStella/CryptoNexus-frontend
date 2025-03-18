"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
const Loan = () => {
  const router = useRouter();

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[17px] pt-[50px]">
      <nav className="fixed z-[999] top-0 left-0 w-full flex justify-start px-[12px] py-[12px] bg-white">
        <figure
          className="w-[30px] h-[23px] relative"
          onClick={() => router.push("/")}
        >
          <Image src={`/assets/icons/Open.jpg`} alt="Open icon" fill />
        </figure>
      </nav>

      <section className="text-white w-full bg-[#22A2B3] flex flex-col justify-start items-start rounded-[7px] px-[11px] py-[25px]">
        <span className="opacity-[.6] text-[12px]">Quota (USDT)</span>
        <p className="mt-[2px] text-[28px] font-medium">0</p>
      </section>

      <section className="my-[12px] w-full flex justify-between items-center">
        <section className=" w-[48%] bg-[#F5F7FB] flex flex-col justify-start items-start rounded-[7px] px-[11px] py-[15px]">
          <span className="opacity-[.6] text-[12px] text-[#999999]">
            Quota (USDT)
          </span>
          <p className="mt-[5px] text-[20px] font-medium text-theme_green">0</p>
        </section>

        <section className=" w-[48%] bg-[#F5F7FB] flex flex-col justify-start items-start rounded-[7px] px-[11px] py-[15px]">
          <span className="opacity-[.6] text-[12px] text-[#999999]">
            Quota (USDT)
          </span>
          <p className="mt-[5px] text-[20px] font-medium text-theme_green">0</p>
        </section>
      </section>

      <section className="my-[5px] w-full flex justify-between items-center h-[45px]">
        <button className="w-[47%] h-full rounded-[5px] text-theme_green border border-theme_green">
          Repayment
        </button>
        <button className="w-[47%] h-full rounded-[5px] bg-theme_green text-white">
          Loan
        </button>
      </section>

      <section className="mt-[30px] w-full flex flex-col justify-start items-center">
        <figure className="w-[180px] h-[120px] relative">
          <Image src={`/assets/images/Nodate.png`} alt="" fill />
        </figure>
        <span className="mt-[6px] text-[#c2c1c1]">Empty</span>
      </section>
    </main>
  );
};

export default Loan;

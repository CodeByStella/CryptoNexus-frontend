"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Debt = () => {
  const router = useRouter();

  const [bottomSection, setBottomSection] = useState<"Home" | "Orders">("Home");
  const [orderTab, setOrderTab] = useState<
    "Hosting" | "pending" | "Lock up" | "Finish" | string
  >("Hosting");
  const orderTabs: string[] = ["Hosting", "pending", "Lock up", "Finish"];

  const [mainTab, setMainTab] = useState<
    "All" | "Ready" | "Buy" | "Locked" | string
  >("All");
  const mainTabs: string[] = ["All", "Ready", "Buy", "Locked"];

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[17px] pt-[50px]">
      <nav className="fixed z-[999] top-0 left-0 w-full flex justify-start px-[12px] py-[12px] bg-white">
        {bottomSection != "Home" ? (
          <figure
            className="w-[30px] h-[23px] relative"
            onClick={() => {
              if (bottomSection == "Orders" || bottomSection == "Entry") {
                setBottomSection("Home");
              }
            }}
          >
            <Image src={`/assets/icons/Open.jpg`} alt="Open icon" fill />
          </figure>
        ) : (
          <figure
            className="w-[30px] h-[23px] relative"
            onClick={() => router.push("/")}
          >
            <Image src={`/assets/icons/Open.jpg`} alt="Open icon" fill />
          </figure>
        )}
      </nav>

      {/* Section */}
      <section className="w-full flex flex-col justify-start items-center font-light text-white bg-[#22A2B3] rounded-[4px] px-[12px] py-[8px]">
        <section className="w-full flex justify-between items-start">
          <section className="flex flex-col justify-start items-start">
            <section className="flex items-center">
              <span className="text-[14px] opacity-[.6] mr-[6px]">
                Entrusted
              </span>
              <figure className="w-[17px] h-[17px] relative">
                <Image
                  src={`/assets/icons/Tether-strategy.png`}
                  alt="Tether icon"
                  fill
                />
              </figure>
            </section>
            <p className="text-[25px] font-medium">0</p>
          </section>
          <button
            onClick={() => {
              setBottomSection("Orders");
            }}
            className="text-theme_green bg-white rounded-[4px] py-[4px] px-[4px] text-[12px]"
          >
            Orders
          </button>
        </section>

        <section className="w-full mt-[12px] flex justify-between items-center">
          <section className="flex flex-col justify-start items-start text-[14px]">
            <span className="opacity-[.6]">Total earnings</span>
            <p>0</p>
          </section>

          <section className="flex flex-col justify-start items-start text-[14px]">
            <span className="opacity-[.6]">{"Today's earnings"}</span>
            <p>0</p>
          </section>
        </section>
      </section>

      {bottomSection == "Home" && (
        <section className="mt-[20px] w-full flex flex-col text-justify items-center">
            {/* Main tabs */}
            <section className="w-full flex justify-between items-center h-[40px]">
                {mainTabs.map((e,i)=>{
                    return (
                        <button onClick={()=>setMainTab(e)} className={`w-[22%] h-full rounded-[6px] ${e==mainTab?"bg-theme_green text-white":"text-[#adadad] border border-[#d9d9d9]"}`} key={i}>
                            {e}
                        </button>
                    )
                })}
            </section>

          {/* card */}
         <section className="w-full rounded-[6px] flex flex-col justify-start items-center my-[20px] shadow-box-soft pb-[17px]">
            <section className="rounded-t-[inherit] text-white bg-[#B8B8B8] w-full py-[4px] flex justify-between items-center px-[17px]">
                <span className="font-bold">test</span>
                <span>21000/30000000</span>
                <span>Buy</span>
            </section>

            <section className="w-full my-[20px] flex justify-between items-center text-[13px]">
                <section className=" pl-[12px] w-[38%] flex flex-col justify-start items-start">
                    <span className="break-words max-w-full">15.00%-15.00%</span>
                    <span className="text-[#aeaeae]">Daily yield</span>
                </section>
                <div className="w-[1px] h-[16px] opacity-[.6] bg-[#959595]"></div>
                <section className=" pl-[12px] w-[38%] flex flex-col justify-start items-start">
                    <span className="break-words max-w-full">825.00%-825.00%</span>
                    <span className="text-[#a3a3a3]">Daily yield</span>
                </section>
                <div className="w-[1px] h-[16px] opacity-[.6] bg-[#aeaeae]"></div>
                <span className="w-[22%] text-center">
                    55 Days
                </span>
            </section>

            <section className="w-full flex justify-end px-[17px]">
                <button className="text-white bg-theme_green rounded-[6px] px-[17px] py-[5px]">Trust</button>
            </section>


         </section>

          {/* card */}
          <section className="w-full rounded-[6px] flex flex-col justify-start items-center my-[20px] shadow-box-soft pb-[17px]">
            <section className="rounded-t-[inherit] text-white bg-[#B8B8B8] w-full py-[4px] flex justify-between items-center px-[17px]">
                <span className="font-bold">test</span>
                <span>21000/30000000</span>
                <span>Ready</span>
            </section>

            <section className="w-full my-[20px] flex justify-between items-center text-[13px]">
                <section className=" pl-[12px] w-[38%] flex flex-col justify-start items-start">
                    <span className="break-words max-w-full">15.00%-15.00%</span>
                    <span className="text-[#aeaeae]">Daily yield</span>
                </section>
                <div className="w-[1px] h-[16px] opacity-[.6] bg-[#959595]"></div>
                <section className=" pl-[12px] w-[38%] flex flex-col justify-start items-start">
                    <span className="break-words max-w-full">825.00%-825.00%</span>
                    <span className="text-[#a3a3a3]">Daily yield</span>
                </section>
                <div className="w-[1px] h-[16px] opacity-[.6] bg-[#aeaeae]"></div>
                <span className="w-[22%] text-center">
                    55 Days
                </span>
            </section>

            <section className="w-full flex justify-end px-[17px]">
                <button className="text-white bg-[#d2d2d2] rounded-[6px] px-[14px] py-[5px]">Trust</button>
            </section>


         </section>
        </section>
      )}

      {bottomSection == "Orders" && (
        <section className="w-full mt-[18px] flex flex-col justify-start items-center">
          <section className="w-full flex justify-between items-center">
            {orderTabs.map((e, i) => {
              return (
                <span
                  onClick={() => setOrderTab(e)}
                  key={i}
                  className={`w-[24%] flex justify-center py-[6px] rounded-[4px] border ${
                    orderTab == e
                      ? "border-theme_green text-theme_green"
                      : "border-[#c8c8c8] text-[#c8c8c8]"
                  }`}
                >
                  {e}
                </span>
              );
            })}
          </section>
          <section className="mt-[30px] w-full flex flex-col justify-start items-center">
            <figure className="w-[180px] h-[120px] relative">
              <Image src={`/assets/images/Nodate.png`} alt="" fill />
            </figure>
            <span className="mt-[6px] text-[#c2c1c1]">Empty</span>
          </section>
        </section>
      )}
    </main>
  );
};
export default Debt;

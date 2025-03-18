"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Mining = () => {
  const router = useRouter();

  const [bottomSection, setBottomSection] = useState<"Home" | "Orders">("Home");
  const [orderTab, setOrderTab] = useState<
    "Hosting" | "pending" | "Lock up" | "Finish" | string
  >("Hosting");
  const orderTabs: string[] = ["Hosting", "pending", "Lock up", "Finish"];

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
          {/* card */}
          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>FPGA</span>

              <section className="opacity-0 flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%] justify-start">
                <figure className="w-[77px] h-[77px] relative">
                  <Image src={"/assets/images/Fpga.jpg"} alt="" fill />{" "}
                </figure>
              </section>
              <section className="w-[73%] flex flex-col justify-start items-center">
                <section className="w-full flex justify-between items-center mb-[4px]">
                  <span className="text-[#9a9a9a] text-[14px]">Amount</span>
                  <span>100-1000000</span>
                </section>

                <section className="w-full flex justify-between items-center mb-[4px]">
                  <span className="text-[#9a9a9a] text-[14px]">
                    Daily yield
                  </span>
                  <span>10.00%-30.00%</span>
                </section>

                <section className="w-full flex justify-between items-center">
                  <span className="text-[#9a9a9a] text-[14px]">Period</span>
                  <span>35 Days</span>
                </section>
              </section>
            </section>

            <section className="w-full flex justify-between items-center ">
              <span className="w-[67%] text-left break-words text-theme_green">
                {"35 days expected return350.00%—1050.00%"}
              </span>

              <button className="py-[5px] px-[20px] text-white rounded-[5px] bg-[silver]">
                Locked
              </button>
            </section>
          </section>

          {/* card */}
          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>IPFS</span>

              <section className="opacity-0 flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%] justify-start">
                <figure className="w-[77px] h-[77px] relative">
                  <Image src={"/assets/images/Ipfs.jpg"} alt="" fill />{" "}
                </figure>
              </section>
              <section className="w-[73%] flex flex-col justify-start items-center">
                <section className="w-full flex justify-between items-center mb-[4px]">
                  <span className="text-[#9a9a9a] text-[14px]">Amount</span>
                  <span>100-1000000</span>
                </section>

                <section className="w-full flex justify-between items-center mb-[4px]">
                  <span className="text-[#9a9a9a] text-[14px]">
                    Daily yield
                  </span>
                  <span>10.00%-30.00%</span>
                </section>

                <section className="w-full flex justify-between items-center">
                  <span className="text-[#9a9a9a] text-[14px]">Period</span>
                  <span>35 Days</span>
                </section>
              </section>
            </section>

            <section className="w-full flex justify-between items-center ">
              <span className="w-[67%] text-left break-words text-theme_green">
                {"35 days expected return350.00%—1050.00%"}
              </span>

              <button className="py-[5px] px-[20px] text-white rounded-[5px] bg-theme_green">
                Trade
              </button>
            </section>
          </section>

          {/* card */}
          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>IPFS</span>

              <section className="opacity-0 flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%] justify-start">
                <figure className="w-[77px] h-[77px] relative">
                  <Image src={"/assets/images/Ipfs.jpg"} alt="" fill />{" "}
                </figure>
              </section>
              <section className="w-[73%] flex flex-col justify-start items-center">
                <section className="w-full flex justify-between items-center mb-[4px]">
                  <span className="text-[#9a9a9a] text-[14px]">Amount</span>
                  <span>100-1000000</span>
                </section>

                <section className="w-full flex justify-between items-center mb-[4px]">
                  <span className="text-[#9a9a9a] text-[14px]">
                    Daily yield
                  </span>
                  <span>10.00%-30.00%</span>
                </section>

                <section className="w-full flex justify-between items-center">
                  <span className="text-[#9a9a9a] text-[14px]">Period</span>
                  <span>35 Days</span>
                </section>
              </section>
            </section>

            <section className="w-full flex justify-between items-center ">
              <span className="w-[67%] text-left break-words text-theme_green">
                {"35 days expected return350.00%—1050.00%"}
              </span>

              <button className="py-[5px] px-[20px] text-white rounded-[5px] bg-theme_green">
                Trade
              </button>
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
export default Mining;

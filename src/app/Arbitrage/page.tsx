"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Arbitrage = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const [bottomSection, setBottomSection] = useState<
    "Home" | "Entry" | "Orders"
  >("Home");
  const [orderTab, setOrderTab] = useState<
    "Hosting" | "pending" | "Lock up" | "Finish" | string
  >("Hosting");
  const orderTabs: string[] = ["Hosting", "pending", "Lock up", "Finish"];

  const exchangeData: { name: string; icon: string; price: number }[] = [
    { name: "Huobi", icon: "/assets/images/Huobi.png", price: 82219.86 },
    { name: "ZB", icon: "/assets/images/ZB.png", price: 82219.86 },
    { name: "Bitfinex", icon: "/assets/images/Bitfinex.png", price: 82219.86 },
    { name: "Bittrex", icon: "/assets/images/Bittrex.png", price: 82219.86 },
  ];

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
              setModalOpen(true);
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

      {/* Bottom sections */}
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

      {bottomSection == "Home" && (
        <>
          <section className="w-full flex justify-start items-center mt-[17px]">
            <section className="w-full flex justify-between items-center p-[10px] rounded-[6px] bg-theme_green">
              <section className="flex items-center">
                <figure className="w-[23px] h-[23px] relative mr-[5px]">
                  <Image
                    src={"/assets/images/Arbitrage-product.png"}
                    alt=""
                    fill
                  />
                </figure>
                <span className="text-[17px] font-normal text-white ">
                  Product
                </span>
              </section>
              <button
                onClick={() => setBottomSection("Entry")}
                className="bg-white text-theme_green py-[2px] px-[30px] rounded-[5px] text-[14px]"
              >
                Entry
              </button>
            </section>
          </section>

          {/* Exchange list */}
          <section className="my-[9px] w-full flex flex-col justify-normal items-center">
            {[...exchangeData, ...exchangeData].map((e, i) => {
              return (
                <section
                  key={i}
                  className={`${i == 3 && "bg-[#F96584] text-white"} 
                  
                  ${i == 4 && "bg-[#45B673] text-white"}
                  ${
                    i < 3 && i > 4 && "border border-[#ebebeb]"
                  } mb-[11px] w-full px-[7px] py-[3px] rounded-[4px] flex justify-between items-center`}
                >
                  <section className="flex items-center w-[50%]">
                    <figure
                      className={`relative w-[38px] h-[38px] ${
                        i < 3 && i > 4 && "shadow-md"
                      } rounded-[50px] mr-[12px]`}
                    >
                      <Image src={e.icon} alt="" fill />
                    </figure>
                    <span className="max-w-[60%] break-words">{e.name}</span>
                  </section>

                  <span>PRICE:&nbsp;{e.price}</span>
                </section>
              );
            })}
          </section>
        </>
      )}

      {bottomSection == "Entry" && (
        <section className="mt-[20px] w-full flex flex-col text-justify items-center">
          {/* card */}
          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>USDT 35 Days</span>

              <section className="flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%]"></section>
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

          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>USDT 35 Days</span>

              <section className="flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%]"></section>
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

          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>USDT 35 Days</span>

              <section className="flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%]"></section>
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

          <section className="mb-[20px] rounded-[8px] w-full flex flex-col justify-start items-center px-[14px] py-[12px] shadow-box-soft">
            <section className="w-full flex justify-between pb-[15px] border-b border-b-[#eaeaeac8]">
              <span>USDT 35 Days</span>

              <section className="flex items-center">
                <span>VIP2</span>
                <figure className="relative  w-[21px] h-[21px] ml-[6px]">
                  <Image src={"/assets/images/Bronze.png"} alt="" fill />
                </figure>
              </section>
            </section>

            <section className="w-full flex justify-between items-center my-[16px]">
              <section className="w-[20%]"></section>
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
    </main>
  );
};

export default Arbitrage;

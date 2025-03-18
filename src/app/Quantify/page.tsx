"use client";
import CustomButton from "@/components/CustomButton/Button";
import { transactionOrders } from "@/utils/cryptoPrices";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Quantify = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const [modalPage, setModalPage] = useState<"Orders" | "Trade">("Orders");
  const [orderTab, setOrderTab] = useState<
    "Hosting" | "pending" | "Lock up" | "Finish" | string
  >("Hosting");
  const orderTabs: string[] = ["Hosting", "pending", "Lock up", "Finish"];

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[17px] pt-[50px]">
      <nav className="fixed z-[999] top-0 left-0 w-full flex justify-start px-[12px] py-[12px] bg-white">
        {modalOpen ? (
          <figure
            className="w-[30px] h-[23px] relative"
            onClick={() => {
              if (modalPage == "Trade") {
                setModalPage("Orders");
              }
              setModalOpen(false);
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
      {modalPage != "Trade" && (
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
                setModalPage("Orders");
                setModalOpen(true);
              }}
              className="text-theme_green bg-white rounded-[4px] py-[4px] px-[4px] text-[12px]"
            >
              Orders
            </button>
          </section>

          <section className="w-full mt-[12px] flex justify-between items-center">
            <section className="flex flex-col justify-start items-start text-[14px]">
              <span className="opacity-[.6]">Total</span>
              <p>0</p>
            </section>

            <section className="flex flex-col justify-start items-start text-[14px]">
              <span className="opacity-[.6]">{"Today's"}</span>
              <p>0</p>
            </section>
          </section>
        </section>
      )}

      {modalPage == "Trade" && (
        <section className="w-full flex flex-col justify-start items-center mt-[50px]">
          {/* Section */}
          <section className="w-full flex-col justify-start items-center p-[14px] rounded-[8px] shadow-lg">
            <section className="w-full flex justify-start">
              <figure className="w-[18px] h-[20px] relative">
                <Image src={`/assets/icons/Guard.png`} alt="Guard icon" fill />
              </figure>
            </section>

            <section className="w-full py-[10px] dotted pl-[30px]">
              <section className="mb-[2px] flex justify-start items-center w-full">
                <span className="w-[30%] text-right text-[#b5b5b5] mr-[20px]">
                  Amount:
                </span>
                <span>0-0</span>
              </section>

              <section className="mb-[2px] flex justify-start items-center w-full">
                <span className="w-[30%] text-right text-[#b5b5b5] mr-[20px]">
                  lianghua.ryl：
                </span>
                <span>0%-0%</span>
              </section>
            </section>

            <section className="w-full py-[10px] dotted pl-[30px]">
              <section className="mb-[2px] flex justify-start items-center w-full">
                <span className="w-[30%] text-right text-[#b5b5b5] mr-[20px]">
                  Cycle:
                </span>
                <span>0 Days</span>
              </section>

              <section className="mb-[2px] flex justify-start items-center w-full">
                <span className="w-[30%] text-right text-[#b5b5b5] mr-[20px]">
                  Date:
                </span>
                <span>03-10-2025</span>
              </section>

              <section className="mb-[2px] flex justify-start items-center w-full">
                <span className="w-[30%] text-right text-[#b5b5b5] mr-[20px]">
                  Dividend
                </span>
                <span>Daily</span>
              </section>
            </section>

            <section className="mt-[12px] w-full flex-col justify-start items-center">
              <section className="w-full flex justify-between items-center">
                <span>Amount</span>
                <span className="text-[14px]">Balance: 0</span>
              </section>

              <section className="mt-[8px] w-full rounded-[8px] flex justify-between items-center bg-[#F5F7FB] px-[10px] py-[12px]">
                <section className="[90%] flex justify-start">
                  <figure className="w-[25px] h-[25px] relative">
                    <Image
                      src={`/assets/icons/Trade-tether.png`}
                      alt="Tether icon"
                      fill
                    />
                  </figure>
                  <input
                    type="text"
                    className="ml-[10px] w-[80%] bg-[#F5F7FB] outline-none h-[25px]"
                  />
                </section>
                <span className="text-[#9f9f9f]">USDT</span>
              </section>

              <section className="w-full mt-[20px]">
                <CustomButton text="Trade Now" width={100} />
              </section>
            </section>
          </section>

          <section className="my-[20px] p-[8px] w-full bg-[#F5F7FB] flex flex-col justify-start items-start">
            {Array(3)
              .fill(0)
              .map((e, i) => {
                return (
                  <section key={i} className="w-full mb-[8px] flex justify-start items-center rounded-[4px]">
                    <figure className="w-[12px] h-[13px] relative mr-[8px]">
                      <Image
                        src={`/assets/icons/Trade-check.png`}
                        alt="Check icon"
                        fill
                      />
                    </figure>
                    <span className="text-[#959595] w-[90%] break-words text-[12px]">
                      {i == 0
                        ? "Daily returns will be sent to your USDT wallet account"
                        : i == 1
                        ? "Your trust funds are at no risk"
                        : "365*24 hours non-stop"}
                    </span>
                  </section>
                );
              })}
          </section>
        </section>
      )}

      {modalOpen && modalPage == "Orders" && (
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
              <Image
                src={`/assets/images/Nodate.png`}
                alt=""
                fill
              />
            </figure>
            <span className="mt-[6px] text-[#c2c1c1]">Empty</span>
          </section>
        </section>
      )}

      {!modalOpen && (
        <>
          {/* Section */}
          <section className="w-full flex flex-col justify-start items-start rounded-[5px] shadow-box-soft mt-[12px] mb-[8px] p-[12px]">
            <span className="text-theme_green text-[20px] font-medium">
              Grid Trading Strategies
            </span>

            <section className="flex flex-col items-start mt-[8px]">
              <label>Managed cycle</label>
              <div className="mt-[4px] px-[7px] py-[3px] flex items-center border border-[#bebebe] rounded-[4px]">
                <span>Select</span>
                <figure className="ml-[60px] w-[20px] h-[20px] relative rotate-[270deg]">
                  <Image src={`/assets/icons/Open.jpg`} alt="Open icon" fill />
                </figure>
              </div>
            </section>

            <section className="my-[12px] w-full flex justify-between items-center">
              <section className="w-[47%] flex items-start flex-col justify-start">
                <span className="text-[14px] text-[#b2b2b2]">Amount</span>
                <p className="text-[15px] ">0-0</p>
              </section>

              <section className="w-[47%] flex flex-col items-end justify-start">
                <span className="text-[14px] text-[#b2b2b2]">Daily Yield</span>
                <p className="text-[15px] ">0-0</p>
              </section>
            </section>

            <section className="w-full flex justify-between items-center">
              <span className="text-theme_green max-w-[60%] break-words text-[14px]">
                0 days expected return 0-0
              </span>
              <button
                onClick={() => {
                  setModalPage("Trade");

                  openModal();
                }}
                className="bg-theme_green text-white py-[4px] px-[25px] rounded-[5px]"
              >
                Trade
              </button>
            </section>
          </section>
          <span className="w-full text-left my-[8px] text-[14px]">
            Grid strategy global transaction order
          </span>

          {/* Transaction orders */}
          <section className="w-full flex flex-col justify-start items-center">
            {transactionOrders.map((e, i) => {
              return (
                <section
                  key={i}
                  className="w-full shadow-box-soft px-[12px] py-[15px] rounded-[5px] mb-[20px]"
                >
                  <section className="w-full mb-[10px] flex justify-between items-center">
                    <span className="w-[45%] break-words text-theme_green text-[12px]">
                      {e.time}
                    </span>
                    <section className="w-[45%] flex justify-between items-center">
                      <span className="text-[12px]">{e.exchange}</span>
                      <span className="text-[12px]">{e.ticker}</span>
                      <span
                        className={`text-[12px] px-[5px] py-[2px] font-light text-white rounded-[50px] ${
                          e.status == "Open"
                            ? "bg-theme_green"
                            : e.status == "Close"
                            ? "bg-theme_red"
                            : "bg-[#6e6e6e]"
                        }`}
                      >
                        {e.status}
                      </span>
                    </section>
                  </section>

                  <section className="w-full flex justify-between items-center">
                    <section className="flex items-center">
                      <span className="text-[12px] text-[#b2b2b2]">
                        Quantity
                      </span>
                      <p className="text-[13px] ml-[5px]">{e.Quantity}</p>
                    </section>

                    <section className="flex items-center justify-start w-[45%]">
                      <span className="text-[12px] text-[#b2b2b2]">Price</span>
                      <p className="text-[13px] ml-[5px]">{e.price}</p>
                    </section>
                  </section>
                </section>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
};

export default Quantify;

"use client";
import CustomButton from "@/components/CustomButton/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Invite = () => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);

  const [tab, setTab] = useState<"Team" | "Commission" | string>("Team");

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-white relative pt-[70px]">
      {/* nav */}
      <nav className="fixed top-0 left-0 w-full flex justify-start px-[12px] py-[12px]">
        {modalOpen ? (
          <figure
            className="w-[30px] h-[23px] relative"
            onClick={() => setModalOpen(false)}
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

      {!modalOpen && (
        <>
          {/* Section */}
          <section className="text-[14px] w-full flex justify-between items-center px-[15px]">
            <section className="flex flex-col justify-start items-center">
              <figure className="mb-[3px] w-[51px] h-[51px] relative">
                <Image src={`/assets/images/Iron.png`} alt="Asset icon" fill />
              </figure>

              <span>VIP1</span>
            </section>

            <section className="w-[50%] flex flex-col justify-start items-center">
              <span className="text-[12px]">0/10000</span>
              <div className="w-full h-[8px] rounded-[8px] bg-[#FFF1D2]"></div>
            </section>

            <section className="flex flex-col justify-start items-center">
              <figure className="mb-[3px] w-[51px] h-[51px] relative">
                <Image
                  src={`/assets/images/Bronze.png`}
                  alt="Asset icon"
                  fill
                />
              </figure>

              <span>VIP1</span>
            </section>
          </section>

          {/* Section */}
          <section className="mt-[30px] w-full">
            {/* section */}
            <section className="w-full flex justify-between items-center">
              <section className="flex flex-col justify-start items-start">
                <span className="text-[#545454] text-[12px]">
                  Cashable(USDT)
                </span>
                <p className="text-[22px] font-medium text-theme_green">0</p>
              </section>

              <button className="border border-theme_green text-theme_green rounded-[4px] text-[14px] px-[15px] py-[5px]">
                Cash
              </button>
            </section>

            <div className="w-full h-[1px] bg-[#e9e9e9bb] my-[20px]"></div>

            {/* section */}
            <section className="w-full flex justify-between items-center">
              <section className="flex flex-col justify-start items-center">
                <span className="text-[10px] text-[#626262]">Accumulated</span>
                <p>0</p>
              </section>

              <div className="w-[1px] h-[25px] bg-[#e9e9e9bb]"></div>

              <section className="flex flex-col justify-start items-center">
                <span className="text-[10px] text-[#626262]">Withdrawn</span>
                <p>0</p>
              </section>
            </section>

            <section className="w-full my-[28px]" onClick={openModal}>
              <CustomButton text="Promote now" width={100} type="button" />
            </section>

            {/* Tab section  */}
            <section className="w-full flex flex-col justify-start items-center mt-[40px]">
              <section className="mb-[20px] w-full flex justify-between items-center">
                <button
                  onClick={() => setTab("Team")}
                  className={`border ${
                    tab == "Team"
                      ? "border-theme_green text-theme_green"
                      : "border-[#c9c9c9] text-[#c9c9c9]"
                  } rounded-[4px] w-[47%] py-[9px]`}
                >
                  Team
                </button>

                <button
                  onClick={() => setTab("Commission")}
                  className={`border ${
                    tab == "Commission"
                      ? "border-theme_green text-theme_green"
                      : "border-[#c9c9c9] text-[#c9c9c9]"
                  } rounded-[4px] w-[47%] py-[9px]`}
                >
                  Commission
                </button>
              </section>

              {/* Tab content */}
              {tab == "Team" && (
                <section className="w-full border-b border-b-[#e5e5e5] py-[12px]  flex justify-start items-center">
                  <span className="mr-[2px] text-[17px]">+</span>&nbsp;
                  <span className="text-[12px]">+234****</span>
                </section>
              )}

              {tab == "Commission" && (
                <section className="w-full border-b font-bold border-b-[#e5e5e5] text-[12px] py-[12px] bg-[#F5F7FB] px-[8px] flex justify-between items-center">
                  <span className="w-[30%] text-left">User</span>
                  <span className="w-[40%] text-left">Time</span>
                  <span className="w-[30%] text-right">Commission</span>
                </section>
              )}
            </section>
          </section>
        </>
      )}

      {modalOpen && (
        <section className="w-full mt-[40px] flex flex-col justify-start items-center">
          <figure className="w-[180px] h-[180px] relative">
            <Image src={`/assets/images/Qr.jpg`} alt="Qr image" fill />
          </figure>

          <section className="my-[20px] w-full flex flex-col justify-start items-start">
            <span className="text-[#bababa] text-[15px]">Share</span>

            <section className="mt-[8px] w-full rounded-[7px] flex justify-between items-center h-[40px] pl-[16px] bg-[#F5F7FB]">
              <span className="w-[80%] overflow-hidden text-[14px]">
                https://cryptosnexus.com/#/p
              </span>
              <button className="flex items-center text-white bg-theme_green rounded-[5px] h-full px-[8px]">
                <figure className="w-[15px] h-[15px] relative mr-[5px]">
                  <Image src={`/assets/images/Copy.png`} alt="Copy icon" fill />
                </figure>
                <span>Copy</span>
              </button>

            </section>
          </section>

          <section className="mt-[12px] w-full flex flex-col justify-start items-start">
            <span className="text-[#bababa] text-[15px]">Invitation code</span>

            <section className="mt-[8px] w-full rounded-[7px] flex justify-between items-center h-[40px] pl-[16px] bg-[#F5F7FB]">
              <span className="w-[80%] overflow-hidden text-[14px]">
                x4qcna
              </span>
              <button className="flex items-center text-white bg-theme_green rounded-[5px] h-full px-[8px]">
                <figure className="w-[15px] h-[15px] relative mr-[5px]">
                  <Image src={`/assets/images/Copy.png`} alt="Copy icon" fill />
                </figure>
                <span>Copy</span>
              </button>

            </section>
          </section>
        </section>
      )}
    </main>
  );
};

export default Invite;

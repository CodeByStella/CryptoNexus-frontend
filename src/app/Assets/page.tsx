"use client";

import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

const Assets = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [prices, setPrices] = useState<{ [key: string]: number }>({}); 
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    if (isLoggedIn === null) {
      router.push("/Login");
    }
  }, [router, isLoggedIn]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,usd-coin,ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setPrices({
          USDT: data.tether.usd,
          BTC: data.bitcoin.usd,
          USDC: data["usd-coin"].usd,
          ETH: data.ethereum.usd,
        });
        setLoadingPrices(false);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
        setLoadingPrices(false);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const actions: string[] = ["Recharge", "Withdrawals", "Exchange"];
  const [viewDetailsPage, setViewDetailsPage] = useState<boolean>(false);
  const modalActions: string[] = [
    "Swap",
    "Seconds",
    "AI arbitrages",
    "Mining Pool",
    "Quantify",
    "Debt",
  ];

  const defaultBalance = [
    { currency: "USDT", amount: 0 },
    { currency: "BTC", amount: 0 },
    { currency: "USDC", amount: 0 },
    { currency: "ETH", amount: 0 },
  ] as const;

  const userBalance = isLoggedIn?.balance?.length ? isLoggedIn.balance : defaultBalance;

  const totalUSDT = userBalance.reduce((sum, bal) => {
    return sum + (bal.amount * (prices[bal.currency] || 0));
  }, 0);

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-[#ECFBFE] relative pb-[120px]">
      {loadingPrices ? (
        <div>Loading prices...</div>
      ) : (
        <>
          {!viewDetailsPage && (
            <>
              <Navbar />
              <section className="bg-white w-full my-[25px] rounded-[8px] shadow-box flex justify-between items-start px-[16px] py-[12px]">
                <section className="flex flex-col items-start">
                  <span className="text-[#8c8c8c] text-[10px]">
                    Total Assets (USDT)
                  </span>
                  <span className="text-[22px]">{totalUSDT.toFixed(2)}</span>
                  <span className="text-[10px] text-[#8c8c8c]">
                    ≈${totalUSDT.toFixed(2)}
                  </span>
                </section>
                <figure className="w-[18px] h-[18px] relative">
                  <Image
                    src={"/assets/icons/Edit-assets.png"}
                    alt="Edit icon"
                    fill
                  />
                </figure>
              </section>

              <section className="w-full flex flex-col justify-center items-center rounded-[5px] bg-[#0052FF] px-[16px] py-[12px]">
                <section className="text-white w-full flex justify-between">
                  <section className="flex flex-col justify-start items-start">
                    <p className="text-[12px] opacity-[.5]">Spot (USDT)</p>
                    <p className="text-[20px]">
                      {(userBalance.find(b => b.currency === 'USDT')?.amount || 0).toFixed(2)}
                    </p>
                  </section>
                  <section className="flex flex-col justify-start items-start">
                    <span className="text-[12px] opacity-[.5]">
                      Portfolio (USDT)
                    </span>
                    <p className="text-[20px]">{totalUSDT.toFixed(2)}</p>
                  </section>
                </section>
                <section
                  onClick={() => setViewDetailsPage(true)}
                  className="text-white w-full flex items-center justify-center mt-[5px]"
                >
                  <p className="mr-[5px]">View details</p>
                  <figure className="w-[16px] h-[16px] relative">
                    <Image
                      src={"/assets/icons/Assets-nav.png"}
                      alt="assets icon"
                      fill
                    />
                  </figure>
                </section>
              </section>

              <section className="mt-[30px] w-full flex justify-between items-center">
                {actions.map((e, i) => (
                  <section
                    key={i}
                    className={`w-[32%] text-[13px] flex flex-col items-center`}
                  >
                    <figure className="mb-[8px] w-[22px] h-[22px] relative">
                      <Link href={`/${e === "Withdrawals" ? e.toLowerCase() : e} `} >
                        <Image
                          src={`/assets/icons/${
                            e === "Recharge" ? "Recharge-crypto" : e
                          }.png`}
                          alt="Asset icon"
                          fill
                        />
                      </Link>
                    </figure>
                    <span>{e}</span>
                  </section>
                ))}
              </section>

              <section className="w-full flex flex-col justify-start items-center mt-[20px]">
                {userBalance.map((bal, i) => (
                  <section
                    key={i}
                    className="w-full flex justify-between items-center border-b border-b-[#e2e2e2] py-[5px]"
                  >
                    <section className="flex justify-start">
                      <figure className="w-[28px] h-[28px] relative mr-[12px]">
                        <Image
                          src={`/assets/images/${bal.currency}-logo.png`}
                          alt="Token image"
                          fill
                        />
                      </figure>
                      <span>{bal.currency}</span>
                    </section>
                    <section className="flex flex-col justify-start items-center">
                      <span>{bal.amount.toFixed(6)}</span>
                      <span className="text-[silver] text-[10px]">
                        ≈${(bal.amount * (prices[bal.currency] || 0)).toFixed(2)}
                      </span>
                    </section>
                  </section>
                ))}
              </section>
            </>
          )}

          {viewDetailsPage && (
            <section className="absolute min-h-screen top-0 left-0 w-full flex flex-col justify-start items-center bg-white">
              <nav className="fixed top-0 left-0 w-full flex justify-start px-[12px] py-[12px]">
                <figure
                  onClick={() => setViewDetailsPage(false)}
                  className="w-[30px] h-[23px] relative"
                >
                  <Image src={`/assets/icons/Open.jpg`} alt="Open icon" fill />
                </figure>
              </nav>
              <section className="mt-[60px] p-[20px] my-[12px] text-white w-[88%] rounded-[6px] flex flex-col justify-start items-start bg-[#0052FF]">
                <span className="opacity-[.5] text-[13px]">
                  Total Assets (USDT)
                </span>
                <p className="text-[27px]">{totalUSDT.toFixed(2)}</p>
              </section>
              <section className="mt-[12px] flex flex-col justify-start w-[88%] items-center">
                {modalActions.map((e, i) => (
                  <section
                    key={i}
                    className="bg-white shadow-lg w-full rounded-[4px] my-[7px] flex justify-between items-center p-[12px]"
                  >
                    <section className="flex items-center">
                      <figure className="mr-[8px] w-[28px] h-[28px] relative">
                        <Image
                          src={`/assets/images/${e}.png`}
                          alt="Asset icon"
                          fill
                        />
                      </figure>
                      <span className="text-[13px] font-light">{e}</span>
                    </section>
                    <section className="flex">
                      <span className="font-light text-[13px]">0 USDT</span>
                      <figure className="rotate-180 ml-[4px] w-[22px] h-[20px] relative">
                        <Image
                          src={`/assets/icons/Open.jpg`}
                          alt="Asset icon"
                          fill
                        />
                      </figure>
                    </section>
                  </section>
                ))}
              </section>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default Assets;
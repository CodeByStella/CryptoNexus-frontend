'use client';

import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import PriceData from "@/components/PriceData/PriceData";
import Slider from "@/components/Slider/Slider";
import Link from "next/link";
import CustomButton from "@/components/CustomButton/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

const NoticeBox = ({ close }: { close: (data: boolean) => void }) => {
  return (
    <section
      className="absolute top-0 left-0 w-full h-[100vh] z-[99] bg-[#00000070] flex justify-center items-center"
      onClick={() => close(false)}
    >
      <section className="bg-white w-[80%] max-w-[300px] py-[8px] px-[10px] rounded-[8px] flex flex-col justify-start items-center">
        <section className="w-full flex justify-end my-[5px]">
          <figure
            className="w-[21px] h-[21px] relative"
            onClick={() => close(false)}
          >
            <Image src={"/assets/icons/Close.png"} alt={"Close icon"} fill />
          </figure>
        </section>
        <p className="font-bold text-center mb-[9px] mt-[-7px]">Notice</p>
        <span className="break-words mb-[20px] text-[12px] text-center">
          Dear customer, welcome to Actisex! Our company in order to give back
          to new and old users, the platform launched a limited time to enjoy
          the USDT position building incentive activities, quota is limited if
          you need to participate in a timely manner to contact online customer
          service to build a position booking, the quota to take a first-come,
          first-served approach. The final right of interpretation of the
          activity belongs to the Actisex Operations Department.
        </span>
      </section>
    </section>
  );
};

const Home: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    USDT: 1,
    BTC: 0,
    USDC: 0,
    ETH: 0,
  });
  const [loadingPrices, setLoadingPrices] = useState(true);

  const services = [
    "Recharge",
    "Invite",
    "Online",
    "Mining-Pool",
    "Quantify",
    "Arbitrage",
    "Loan",
    "Debt",
  ];

  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);

  useEffect(() => {
    if (noticeOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [noticeOpen]);

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
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center bg-white relative px-[12px] pb-[85px]">
      {noticeOpen && <NoticeBox close={setNoticeOpen} />}

      {/* Section 1 */}
      <section className="mt-[10px] w-full flex justify-between items-center">
        <figure className="w-[32px] h-[32px] relative rounded-[50px]">
          <Link
            href={"/profile"}
            className="w-[48%] flex justify-center bg-theme_green rounded-[6px] py-[5px] text-white"
          >
            <Image
              src={`/assets/images/logo.png`}
              alt={`Logo image`}
              fill
              className="rounded-[inherit]"
            />
          </Link>
        </figure>

        <section className="flex items-center">
          <figure className="w-[23px] h-[23px] relative">
            <Image
              src={`/assets/icons/Language.png`}
              alt={`Language icon`}
              fill
            />
          </figure>
          <span className="ml-[4px] text-[18px]">English</span>
        </section>
      </section>

      {/* Section 2 */}
      <section className="w-full flex justify-between items-center mt-[17px]">
        {!isLoggedIn ? (
          <section className="w-full flex justify-between items-center mb-[10px]">
            <Link
              href={"/Login"}
              className="w-[48%] flex justify-center bg-theme_green rounded-[6px] py-[5px] text-white"
            >
              Login
            </Link>
            <Link
              href={"/Register"}
              className="w-[48%] flex justify-center bg-theme_green rounded-[6px] py-[5px] text-white"
            >
              Register
            </Link>
          </section>
        ) : (
          <>
            <section className="text-[20px] flex flex-col justify-start items-start">
              <p className="text-[#9CA2A8]">Total Assets (USDT)</p>
              <span className="my-[12px]">{totalUSDT.toFixed(2)}</span>
            </section>
            <figure className="w-[27px] h-[27px] relative rounded-[50px]">
              <Image
                src={`/assets/icons/Assets-nav.png`}
                alt={`Assets nav icon`}
                fill
              />
            </figure>
          </>
        )}
      </section>

      <Slider />

      {/* Section 4 */}
      <section
        className="w-full flex justify-between items-center my-[25px] px-[5px]"
        onClick={() => setNoticeOpen(true)}
      >
        <section className="flex items-center">
          <figure className="w-[16px] h-[16px] relative mr-[8px]">
            <Image src={`/assets/icons/Notice.png`} alt={`Notice icon`} fill />
          </figure>
          <section className="flex items-center">
            <p className="flex items-center">Notice</p>
            <div className="bg-black w-[1px] mx-[7px] h-[15px]"></div>
            <span className="text-[#0052FF]">Notice</span>
          </section>
        </section>
        <figure className="w-[16px] h-[16px] relative">
          <Image src={`/assets/icons/Menu.png`} alt={`Menu icon`} fill />
        </figure>
      </section>

      <section className="rounded-[8px] shadow-box bg-white w-full h-[160px] flex justify-center items-center flex-wrap">
        {services.map((each, i) => (
          <Link
            href={`${each}`}
            key={i}
            className="flex flex-col justify-center items-center h-[70px] w-[24%]"
          >
            <figure className="w-[28px] h-[28px] mb-[2px] relative">
              <Image
                src={`/assets/icons/${each}.png`}
                alt={`Service icon for ${each}`}
                fill
                style={{ objectFit: "contain" }} // Ensure image fits within bounds
                onError={(e) => {
                  console.error(`Failed to load image for ${each}:`, e);
                  (e.target as HTMLImageElement).src = "/assets/icons/default.png"; // Fallback image
                }}
              />
            </figure>
            <span className="text-[14px] text-center w-full">
              {each.includes("Pool") ? `${each.split("-").join(" ")}` : each}
            </span>
          </Link>
        ))}
      </section>

      <PriceData />
      <Navbar />
    </main>
  );
};

export default Home;
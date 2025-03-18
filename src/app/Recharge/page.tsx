"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { fetchDepositAddresses } from "@/services/api";
import { QRCodeSVG } from "qrcode.react";
import SuccessModal from "./successModal"; 

type DropUpCurrencySelectorProps = {
  currencies: string[];
  dropUpOpen: Boolean;
  closeDropUp: () => void;
  setSelectedCurrency: (p: string) => void;
};

type AddressData = {
  chain: string;
  address: string;
  _id: string;
};

export interface DepositAddress {
  _id: string;
  token: string;
  addresses: AddressData[];
  createdAt: string;
  updatedAt: string;
}

const DropUpCurrencySelector: React.FC<DropUpCurrencySelectorProps> = ({
  currencies,
  dropUpOpen,
  setSelectedCurrency,
  closeDropUp,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(2);

  const handleScroll = () => {
    if (!listRef.current) return;

    const list = listRef.current;
    const listRect = list.getBoundingClientRect();
    const listCenter = listRect.top + listRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    list.childNodes.forEach((child, index) => {
      const childRect = (child as HTMLElement).getBoundingClientRect();
      const childCenter = childRect.top + childRect.height / 2;
      const distance = Math.abs(childCenter - listCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
  };

  useEffect(() => {
    if (!dropUpOpen || !listRef.current) return;

    const list = listRef.current;
    list.addEventListener("scroll", handleScroll);

    return () => list.removeEventListener("scroll", handleScroll);
  }, [dropUpOpen]);

  useEffect(() => {
    if (!listRef.current) return;

    const list = listRef.current;
    const selectedChild = list.children[selectedIndex] as HTMLElement;

    if (selectedChild) {
      const scrollPosition =
        selectedChild.offsetTop -
        (list.offsetHeight - selectedChild.offsetHeight) / 2;

      list.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }, [currencies, selectedIndex, dropUpOpen]);

  useEffect(() => {
    if (!listRef.current) return;

    const list = listRef.current;
    const firstChild = list.children[0] as HTMLElement;
    const lastChild = list.children[list.children.length - 1] as HTMLElement;

    if (firstChild && lastChild) {
      list.style.paddingTop = `${
        list.offsetHeight / 2 - firstChild.offsetHeight / 2
      }px`;
      list.style.paddingBottom = `${
        list.offsetHeight / 2 - lastChild.offsetHeight / 2
      }px`;
    }
  }, [currencies]);

  return (
    <AnimatePresence>
      {dropUpOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDropUp}
        >
          <div className="mb-[-8px] w-full py-[12px] border-none bg-white flex justify-between items-center font-light px-[17px]">
            <span className="text-[#888888]" onClick={closeDropUp}>
              Cancel
            </span>
            <span
              className="text-[#3C9CFF]"
              onClick={() => setSelectedCurrency(currencies[selectedIndex])}
            >
              Confirm
            </span>
          </div>
          <motion.div
            className="w-full h-[30vh] bg-white px-6 flex flex-col items-center relative"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-1/2 left-0 w-full h-10 border-t border-b border-gray-300 -translate-y-1/2 pointer-events-none" />

            <div
              ref={listRef}
              className="w-full h-full overflow-y-auto hide-scrollbar"
              style={{ scrollBehavior: "smooth" }}
            >
              {currencies.map((currency, i) => (
                <div
                  key={i}
                  className={`w-full text-center py-3 text-lg transition-all duration-200 ${
                    i === selectedIndex
                      ? "font-bold text-black"
                      : "font-light text-gray-500"
                  }`}
                >
                  {currency}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function MyQRCode({ value }: { value: string }) {
  return <QRCodeSVG value={value} size={150} />;
}

const Recharge = () => {
  const [page, setPage] = useState<
    | string
    | "Crypto select"
    | "Crypto upload"
    | "Bank deposit"
    | "Bank deposit submitted"
  >("Crypto select");

  const [depositAddresses, setDepositAddresses] = useState<DepositAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedToken, setSelectedToken] = useState<string>("USDT");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [availableChains, setAvailableChains] = useState<string[]>([]);

  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [currencyDropup, setCurrencyDropup] = useState<boolean>(false);
  const openDropup = () => setCurrencyDropup(true);
  const closeDropUp = () => setCurrencyDropup(false);
  const [amount, setAmount] = useState<string>("");

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!amount) {
      alert("Please enter an amount.");
      return;
    }
    if (!screenshot) {
      alert("Please upload a receipt image.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("token", selectedToken);
    formData.append("chain", selectedChain);
    formData.append("screenshot", screenshot);

    try {
      // Send the deposit details to the server
      const response = await fetch("process.env.SERVER_RUL/api/deposits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit deposit");
      }

      // Show the success modal
      setShowSuccessModal(true);

      // Reset form fields
      setAmount("");
      setScreenshot(null);
      setPreview(null);
    } catch (err: any) {
      console.error("Error submitting deposit:", err);
      alert(err.message || "Failed to submit deposit. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setPage("Crypto select"); // Redirect back to the Crypto select page after closing
  };

  const handleCheckOrder = () => {
    setShowSuccessModal(false);
    // Redirect to a deposit history page (adjust the path as needed)
    window.location.href = "/";
  };

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "CHF",
    "CNY",
    "INR",
    "BTC",
  ];

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);

        const data: DepositAddress[] = await fetchDepositAddresses();
        if (!data || data.length === 0) {
          throw new Error("No deposit addresses found");
        }

        setDepositAddresses(data);

        const firstToken = data[0];
        setSelectedToken(firstToken.token);

        if (firstToken.addresses.length > 0) {
          const chains = firstToken.addresses.map((addr: AddressData) => addr.chain);
          setAvailableChains(chains);
          setSelectedChain(chains[0]);
          setSelectedAddress(firstToken.addresses[0].address);
        }
      } catch (err) {
        setError("Error fetching deposit addresses");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const selectedTokenData = depositAddresses.find((token) => token.token === selectedToken);
    if (selectedTokenData) {
      const chains = selectedTokenData.addresses.map((addr) => addr.chain);
      setAvailableChains(chains);

      if (chains.length > 0) {
        setSelectedChain(chains[0]);

        const addressObj = selectedTokenData.addresses.find((addr) => addr.chain === chains[0]);
        if (addressObj) {
          setSelectedAddress(addressObj.address);
        }
      }
    }
  }, [selectedToken, depositAddresses]);

  useEffect(() => {
    const selectedTokenData = depositAddresses.find((token) => token.token === selectedToken);
    if (selectedTokenData) {
      const addressObj = selectedTokenData.addresses.find((addr) => addr.chain === selectedChain);
      if (addressObj) {
        setSelectedAddress(addressObj.address);
      }
    }
  }, [selectedChain, selectedToken, depositAddresses]);

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    setPage("Crypto upload");
  };

  return (
    <main className="pt-[40px] font-[Inter] w-full min-h-screen flex justify-start items-center bg-white relative px-[15px]">
      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={handleCloseModal} onCheckOrder={handleCheckOrder} />
      )}

      <nav className="fixed top-0 left-0 w-full flex justify-start items-center h-[40px] z-[9] bg-white px-[12px]">
        {page === "Crypto select" ? (
          <Link href="/">
            <figure className="w-[30px] h-[23px] relative">
              <Image src="/assets/icons/Open.jpg" alt="Open icon" fill />
            </figure>
          </Link>
        ) : (
          <section onClick={() => setPage("Crypto select")}>
            <figure className="w-[30px] h-[23px] relative">
              <Image src="/assets/icons/Open.jpg" alt="Open icon" fill />
            </figure>
          </section>
        )}
      </nav>

      {page === "Crypto select" && (
        <>
          <section className="pt-[30px] w-full h-screen px-[20px] flex flex-col justify-start items-center">
            <section className="w-full flex justify-between items-center">
              <figure className="w-[140px] h-[80px] relative">
                <Image src="/assets/images/Deposit-img.png" alt="Deposit image" fill />
              </figure>

              <section className="flex justify-start items-center" onClick={() => setPage("Bank deposit")}>
                <span className="text-[17px] text-theme_green mr-[8px]">Bank Deposit</span>

                <figure className="w-[25px] h-[25px] relative">
                  <Image src="/assets/images/Option.png" alt="Option image" fill />
                </figure>
              </section>
            </section>

            <section className="mt-[35px] w-full flex flex-col justify-start items-start">
              <span className="mb-[8px] font-semibold text-[#828282] text-[16px]">
                Please select currency
              </span>

              {isLoading ? (
                <div className="w-full text-center py-4">Loading...</div>
              ) : error ? (
                <div className="w-full text-center text-red-500 py-4">{error}</div>
              ) : (
                <section className="w-full flex justify-between items-center">
                  {depositAddresses.map((tokenData, i) => (
                    <figure
                      onClick={() => handleTokenSelect(tokenData.token)}
                      key={i}
                      className="w-[56px] h-[56px] mb-[2px] relative cursor-pointer"
                    >
                      <Image
                        src={`/assets/images/${tokenData.token}-logo.png`}
                        alt={`${tokenData.token} logo`}
                        fill
                      />
                    </figure>
                  ))}
                </section>
              )}
            </section>
          </section>
        </>
      )}

      {page === "Crypto upload" && (
        <>
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center px-4 pb-8">
            <figure className="w-[185px] h-[185px] mx-auto">
              <QRCodeSVG value={selectedAddress} size={180} />
            </figure>

            <span className="break-words w-full text-center text-sm my-4">{selectedAddress}</span>

            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(selectedAddress)}
              className="flex items-center bg-theme_green text-white rounded px-4 py-2"
            >
              <Image src="/assets/images/Copy.png" alt="Copy" width={20} height={20} className="mr-2" />
              <span>Copy</span>
            </button>

            <section className="w-full flex flex-col my-5">
              <input
                type="text"
                className="bg-gray-100 rounded-lg p-3 w-full outline-none text-black"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="mt-2 text-sm">
                ≈ <span className="text-green-500">{amount || "0"}</span> {selectedChain}
              </p>
            </section>

            <section className="w-full flex flex-col">
              <span className="text-gray-600">Chain</span>
              <div className="flex justify-between mt-2">
                {availableChains.map((chain) => (
                  <div
                    key={chain}
                    onClick={() => setSelectedChain(chain)}
                    className={`cursor-pointer py-3 w-[30%] text-center font-medium rounded-lg border
                      ${selectedChain === chain ? "text-theme_green border-theme_green" : "text-gray-400 border-gray-400"}`}
                  >
                    {chain}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 w-full flex flex-col">
              <span>Upload Receipt</span>
              <label className="mt-2 cursor-pointer w-[115px] h-[106px] flex items-center justify-center border border-dotted rounded-lg">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                {preview ? (
                  <Image src={preview} alt="Receipt preview" width={115} height={106} className="rounded-lg" />
                ) : (
                  <Image src="/assets/images/Upload.png" alt="Upload" width={50} height={50} />
                )}
              </label>
            </section>

            <section className="w-full flex flex-col mt-6 text-gray-500 text-sm">
              <span>Tips</span>
              <p className="mt-2">1. Submit your deposit receipt after completing the transaction.</p>
              <p>2. Ensure you&apos;re using the official platform deposit address.</p>
              <p>3. Network confirmations are required for funds to be credited.</p>
              <p>4. Keep your device secure to prevent tampering.</p>
            </section>

            <button type="submit" className="w-full bg-theme_green text-white rounded-lg py-3 mt-6">
              Submit
            </button>
          </form>
        </>
      )}

      <DropUpCurrencySelector
        currencies={currencies}
        closeDropUp={closeDropUp}
        dropUpOpen={currencyDropup}
        setSelectedCurrency={setSelectedCurrency}
      />

      {page === "Bank deposit" && (
        <>
          <section className="w-full flex flex-col justify-start items-center h-[90vh] mt-[20px]">
            <section
              onClick={openDropup}
              className="w-full flex justify-between items-center px-[20px] py-[17px] shadow-box"
            >
              <span>{selectedCurrency}</span>

              <figure className="w-[22px] h-[22px] relative">
                <Image src="/assets/images/Open-currency.png" alt="Open icon" fill />
              </figure>
            </section>

            <section className="w-full flex flex-col justify-start items-start my-[25px]">
              <section className="mb-[8px] w-full rounded-[5px] py-[12px] px-[15px] flex justify-between items-center text-[14px] bg-[#F5F7FA]">
                <span className="text-[#C0C4CC] text-[17px]">Amount</span>
              </section>

              <span>≈$ 19.5 USDT</span>
            </section>

            <button
              onClick={() => setPage("Bank deposit submitted")}
              className="w-full bg-theme_green text-white rounded-[8px] py-[14px] my-[8px]"
            >
              Place Order
            </button>
          </section>
        </>
      )}

      {page === "Bank deposit submitted" && (
        <>
          <section className="w-full flex flex-col justify-center h-screen items-center relative">
            <figure className="w-[70px] h-[70px] relative">
              <Image src="/assets/images/Bank-deposit.png" alt="Deposit image" fill />
            </figure>

            <span className="text-[30px] font-bold my-[20px] w-full text-center break-words">
              Bank deposit order submitted
            </span>

            <p className="my-[12px] text-center">
              For the safety of your funds, please contact our{" "}
              <span className="text-theme_green">Online service</span> support to obtain guidance on bank
              deposits
            </p>

            <Link
              href="/"
              className="absolute bottom-[65px] flex justify-center items-center left-0 w-full bg-theme_green text-white rounded-[8px] py-[15px]"
            >
              Return to Home
            </Link>
          </section>
        </>
      )}
    </main>
  );
};

export default Recharge;
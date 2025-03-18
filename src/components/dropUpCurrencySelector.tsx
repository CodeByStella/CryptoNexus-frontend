// src/components/DropUpCurrencySelector.tsx
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type DropUpCurrencySelectorProps = {
  currencies: string[];
  dropUpOpen: Boolean;
  closeDropUp: () => void;
  setSelectedCurrency: (p: string) => void;
};

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

export default DropUpCurrencySelector;
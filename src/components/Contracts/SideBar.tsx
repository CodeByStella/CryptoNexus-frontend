import { AnimatePresence, motion } from "framer-motion";
import { MarketTicker } from "@/types";

type SidebarProps = {
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  setCurrentTicker: (t: MarketTicker) => void;
  marketTickers: MarketTicker[];
};

export const Sidebar = ({
  closeSidebar,
  setCurrentTicker,
  sidebarOpen,
  marketTickers,
}: SidebarProps) => {
  const sidebarVariants = { hidden: { x: "-100%" }, visible: { x: "0%" } };
  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeSidebar}
        >
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white px-[23px] pt-[25px] w-[70vw] max-w-[250px]"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <section className="text-[#9d9d9d] w-full flex font-light justify-between items-center">
              <span>Name</span>
              <span>Prices/24H</span>
            </section>
            <section className="w-full h-[75vh] mt-[8px] overflow-y-auto hide-scrollbar">
              {marketTickers.map((e, i) => (
                <section
                  key={i}
                  onClick={() => {
                    setCurrentTicker(e);
                    closeSidebar();
                  }}
                  className="w-full cursor-pointer flex justify-between items-start py-[4px] border-b-[1px] border-[#e4e3e3]"
                >
                  <span>{e.m}</span>
                  <section className="flex flex-col justify-start items-end">
                    <span>{e.c.toFixed(4)}</span>
                    <span
                      className={`mt-[5px] ${
                        e.ch > 0 ? "text-theme_green" : "text-theme_red"
                      }`}
                    >
                      {e.ch > 0 ? "+" : "-"}
                      {Math.abs(e.ch * 100).toFixed(2)}%
                    </span>
                  </section>
                </section>
              ))}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
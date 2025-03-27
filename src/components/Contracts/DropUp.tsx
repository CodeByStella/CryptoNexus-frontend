import { AnimatePresence, motion } from "framer-motion";

type DropUpProps = {
  dropUpOpen: boolean;
  closeDropUp: () => void;
  data: (string | number)[];
  setSelectedOption: (p: any) => void;
};

export const DropUp = ({ dropUpOpen, closeDropUp, data, setSelectedOption }: DropUpProps) => {
  const dropUpVariants = { hidden: { y: "100%" }, visible: { y: "0%" } };
  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <AnimatePresence>
      {dropUpOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeDropUp}
        >
          <motion.div
            className="absolute bottom-0 w-full bg-white flex flex-col items-center justify-center"
            variants={dropUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {data.map((e, i) => (
              <span
                key={i}
                onClick={() => {
                  setSelectedOption(e);
                  closeDropUp();
                }}
                className="w-full text-center py-2 border-b border-gray-300 text-lg font-normal cursor-pointer"
              >
                {e}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
import React from "react";

type props = {
  text: string;
  width: number;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  bg?: string;
  type: "button" | "submit";
};

const CustomButton = ({ text, width, bg, onClick, type }: props) => {
  return (
    <button
      style={{ width: `${width}%` }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      type={type}
      className={`${
        bg ? `bg-${bg}` : `bg-theme_green`
      } rounded-[6px] py-[10px] text-white font-[Inter]`}
    >
      {text}
    </button>
  );
};

export default CustomButton;

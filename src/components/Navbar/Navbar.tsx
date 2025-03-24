"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const pages = ["Home", "Markets", "Contracts", "Assets"];

  return (
    <nav className="z-[99] w-full fixed bottom-0 left-0 h-[90px] bg-white px-[30px] flex justify-between items-center">
      {pages.map((each, i) => (
        <Link
          href={`/${each === "Home" ? "" : each}`}
          key={i}
          className="flex flex-col justify-start items-center"
        >
          <figure className="w-[24px] h-[24px] relative">
            {each === "Home" && pathname.split("/")[1] === "" ? (
              <Image
                src={`/assets/icons/Home.png`}
                alt={`${each} icon`}
                fill
              />
            ) : (
              <Image
                src={
                  pathname.split("/")[1] === each
                    ? `/assets/icons/${each}.png`
                    : `/assets/icons/${each}-inactive.png`
                }
                alt={`${each} icon`}
                fill
              />
            )}
          </figure>
          {each === "Home" && pathname.split("/")[1] === "" ? (
            <span className="text-[#22A2B3]">{each}</span>
          ) : (
            <span
              className={`${
                pathname.split("/")[1] === each
                  ? "text-[#22A2B3]"
                  : "text-[#9CA2A8]"
              }`}
            >
              {each}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
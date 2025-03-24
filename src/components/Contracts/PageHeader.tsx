type PageHeaderProps = {
    tabs: string[];
    currentTab: string;
    setCurrentTab: (data: string) => void;
  };
  
  export const PageHeader = ({ tabs, currentTab, setCurrentTab }: PageHeaderProps) => (
    <section className="w-full flex justify-between items-center px-[20px] mt-[12px]">
      {tabs.map((each, i) => (
        <section
          key={i}
          className="cursor-pointer flex flex-col justify-start items-center"
        >
          <span
            onClick={() => setCurrentTab(each)}
            className={`mb-[8px] inline-block ${
              each === currentTab ? `text-theme_green` : `text-black`
            }`}
          >
            {each}
          </span>
          <div
            className={`${
              each === currentTab ? `opacity-1` : `opacity-0`
            } w-[45px] h-[3px] bg-theme_green`}
          ></div>
        </section>
      ))}
    </section>
  );
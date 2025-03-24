export type featuredTokenType = {
    ticker: string,
    changeRate: number,
    changeRateMode: "High" | "Low",
    value: number,
    approxValue: number
}

type ChangeDirection = "High" | "Low";


export type CryptoPrice = {
    ticker: string;
    value: number; // 4 decimal places
    changeRate: number;
    changeDirection: "High" | "Low";
  }
export interface PriceDataItem extends CryptoPrice {
    icon: string;
};

export type dataToRenderType = {
    icon: string;
    ticker: string;
    value: number;
    changeRate: number;
    changeDirection: "High" | "Low";
};

export type MochPriceData = {
    [category: string]: PriceDataItem[];
};

export const mochPriceData: MochPriceData = {
    "Precious metals": [
        { icon: "/assets/images/XAP.svg", value: Math.random() * 3000, ticker: "XAP", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" },
        { icon: "/assets/images/XPD.svg", value: Math.random() * 3000, ticker: "XPD", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "Low" },
        { icon: "/assets/images/XAU.svg", value: Math.random() * 3000, ticker: "XAU", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" }
    ],
    "Digital currency": [
        { icon: "/assets/images/BTC.png", value: Math.random() * 60000, ticker: "BTC", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" },
        { icon: "/assets/images/ETH.png", value: Math.random() * 4000, ticker: "ETH", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "Low" },
        { icon: "/assets/images/LTC.png", value: Math.random() * 1, ticker: "XRP", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" }
    ],
    "Forex": [
        { icon: "/assets/images/CADUSD.png", value: Math.random() * 1.5, ticker: "CADUSD", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" },
        { icon: "/assets/images/CNYUSD.png", value: Math.random() * 1.5, ticker: "CNYUSD", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "Low" },
        { icon: "/assets/images/THBUSD.png", value: Math.random() * 1.5, ticker: "THBUSD", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" }
    ],
    "Index": [
        { icon: "/assets/images/DIJA.svg", value: Math.random() * 40000, ticker: "DIJA", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" },
        { icon: "/assets/images/SPX.svg", value: Math.random() * 5000, ticker: "SPX", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "Low" },
        { icon: "/assets/images/NDX.svg", value: Math.random() * 15000, ticker: "NDX", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" }
    ],
    "Futures": [
        { icon: "/assets/images/AU.svg", value: Math.random() * 2000, ticker: "AU", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" },
        { icon: "/assets/images/AG.svg", value: Math.random() * 1000, ticker: "AG", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "Low" },
        { icon: "/assets/images/PT.svg", value: Math.random() * 3000, ticker: "PT", changeRate: Number((Math.random() * 2).toFixed(2)), changeDirection: "High" }
    ]
};
export interface PriceDataItem {
    icon: string;
    ticker: string;
    value: number;
    changeRate: number;
    changeDirection: "High" | "Low";
  }
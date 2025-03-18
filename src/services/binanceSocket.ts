import axios from 'axios';
import { PriceDataItem } from "@/types/types";

type TickerCallback = (data: {
  c: number;
  o: number;
  h: number;
  l: number;
  v: number;
  m: string;
  bv: number;
  ch: number;
  icon: string;
  channel: string;
  scode: string;
  lineChart: string;
  T: number;
  t: number;
}) => void;

type CategoryType = "Precious metals" | "Digital currency" | "Forex" | "Index" | "Futures";

const API_ENDPOINTS = {
  crypto: 'https://actisexa.xyz/api/public/ticker',
  forex: 'https://actisexa.xyz/api/public/tickerForex?type=currencys',
  index: 'https://actisexa.xyz/api/public/tickerForex?type=index',
  gold: 'https://actisexa.xyz/api/public/tickerForex?type=gold',
  futures: 'https://actisexa.xyz/api/public/tickerForex?type=futures',
};

class MarketDataService {
  private callbacks: TickerCallback[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private dataCache: Record<string, any[]> = {};

  private async fetchData() {
    try {
      for (const key in API_ENDPOINTS) {
        const response = await axios.get(API_ENDPOINTS[key as keyof typeof API_ENDPOINTS]);
        if (response.data.success) {
          this.dataCache[key] = response.data.result;
          response.data.result.forEach((item: any) => {
            item.category = key;
            if (key === 'gold' || key === 'futures') {
              item.m = item.scode;
            }
            this.callbacks.forEach(callback => callback(item));
          });
        }
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  startFetching(interval: number = 5000): void {
    if (this.intervalId) return;
    this.fetchData();
    this.intervalId = setInterval(() => this.fetchData(), interval);
  }

  stopFetching(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(callback: TickerCallback): void {
    this.callbacks.push(callback);
    for (const key in this.dataCache) {
      this.dataCache[key].forEach(item => {
        item.category = key;
        if (key === 'gold' || key === 'futures') {
          item.m = item.scode;
        }
        callback(item);
      });
    }
  }

  unsubscribe(callback: TickerCallback): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  fetchMarketData(category: CategoryType, callback: (data: PriceDataItem[]) => void): void {
    const categoryToEndpoint: Record<CategoryType, keyof typeof API_ENDPOINTS> = {
      "Digital currency": "crypto",
      "Precious metals": "gold",
      "Forex": "forex",
      "Index": "index",
      "Futures": "futures",
    };
    
    const endpoint = categoryToEndpoint[category];
    
    if (this.dataCache[endpoint]) {
      const result = this.dataCache[endpoint].map(data => ({
        icon: data.icon || `/icons/${data.scode?.toLowerCase().replace(/\s/g, '')}.png`,
        ticker: (endpoint === 'gold' || endpoint === 'futures') ? data.scode : data.m,
        value: Number(parseFloat(data.c).toFixed(4)), // Apply toFixed(4) here
        changeDirection: parseFloat(data.ch) >= 0 ? "High" : "Low",
        changeRate: Number(Math.abs(parseFloat(data.ch)).toFixed(4)), // Apply toFixed(4) here
      }));
      callback(result);
      return;
    }
    
    axios.get(API_ENDPOINTS[endpoint])
      .then(response => {
        if (response.data.success) {
          this.dataCache[endpoint] = response.data.result;
          
          const result = response.data.result.map((data: any) => ({
            icon: data.icon || `/icons/${data.scode?.toLowerCase().replace(/\s/g, '')}.png`,
            ticker: (endpoint === 'gold' || endpoint === 'futures') ? data.scode : data.m,
            value: Number(parseFloat(data.c).toFixed(4)), // Apply toFixed(4) here
            changeDirection: parseFloat(data.ch) >= 0 ? "High" : "Low",
            changeRate: Number(Math.abs(parseFloat(data.ch)).toFixed(4)), // Apply toFixed(4) here
          }));
          
          callback(result);
        } else {
          callback([]);
        }
      })
      .catch(error => {
        console.error(`Error fetching ${category} data:`, error);
        callback([]);
      });
  }
}

const marketDataService = new MarketDataService();
export default marketDataService;
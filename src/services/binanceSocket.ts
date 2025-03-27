import { io, Socket } from 'socket.io-client';

interface PriceDataItem {
  icon: any;
  ticker: any;
  value: number;
  changeDirection: 'High' | 'Low';
  changeRate: number;
}

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

type CategoryType = 'Precious metals' | 'Digital currency' | 'Forex' | 'Index' | 'Futures';

class MarketDataService {
  private callbacks: TickerCallback[] = [];
  private socket: Socket | null = null;

  constructor() {
    this.connectSocket();
  }

  private connectSocket() {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('marketData', (data: { success: boolean; result: Record<string, any[]> }) => {
      if (data.success) {
        // No caching - directly process and send to callbacks
        for (const key in data.result) {
          data.result[key].forEach((item) => {
            item.category = key;
            if (key === 'gold' || key === 'futures') {
              item.m = item.scode;
            }
            this.callbacks.forEach((callback) => callback(item));
          });
        }
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  }

  startFetching(): void {
    if (!this.socket || !this.socket.connected) {
      this.connectSocket();
    }
  }

  stopFetching(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(callback: TickerCallback): void {
    this.callbacks.push(callback);
    // No initial cache to send - subscribers rely on live updates only
  }

  unsubscribe(callback: TickerCallback): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  // Commented out since it relied on dataCache, which is removed
  /*
  fetchMarketData(category: CategoryType, callback: (data: PriceDataItem[]) => void): void {
    const categoryToEndpoint: Record<CategoryType, string> = {
      'Digital currency': 'crypto',
      'Precious metals': 'gold',
      'Forex': 'forex',
      'Index': 'index',
      'Futures': 'futures',
    };

    const endpoint = categoryToEndpoint[category];

    if (this.dataCache[endpoint]) {
      const result = this.dataCache[endpoint].map((data) => ({
        icon: data.icon || `/icons/${data.scode?.toLowerCase().replace(/\s/g, '')}.png`,
        ticker: (endpoint === 'gold' || endpoint === 'futures') ? data.scode : data.m,
        value: Number(parseFloat(data.c).toFixed(4)),
        changeDirection: parseFloat(data.ch) >= 0 ? 'High' : 'Low',
        changeRate: Number(Math.abs(parseFloat(data.ch)).toFixed(4)),
      })) as PriceDataItem[];
      callback(result);
    } else {
      callback([]);
    }
  }
  */
}

const marketDataService = new MarketDataService();
export default marketDataService;
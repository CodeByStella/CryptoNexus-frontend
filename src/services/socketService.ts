import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket;
  private static instance: SocketService;

  private constructor() {
    this.socket = io(API_BASE_URL, { autoConnect: false });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
      console.log("Socket connected");
    }
  }

  public disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
      console.log("Socket disconnected");
    }
  }

  public getSocket(): Socket {
    return this.socket;
  }
}

export const socketService = SocketService.getInstance();
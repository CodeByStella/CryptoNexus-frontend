import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket;
  private static instance: SocketService;

  private constructor() {
    this.socket = io("http://localhost:5000", { autoConnect: false });
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
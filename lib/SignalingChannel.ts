// lib/SignalingChannel.ts
type MessageCallback = (message: any) => void;

class SignalingChannel {
  private socket: WebSocket;
  private messageListeners: MessageCallback[] = [];

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageListeners.forEach((listener) => listener(message));
    };
  }

  send(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  // Accept any string as an event type
  addEventListener(event: string, callback: MessageCallback) {
    if (event === 'message') {
      this.messageListeners.push(callback);
    }
  }

  close() {
    this.socket.close();
  }
}

export default SignalingChannel;

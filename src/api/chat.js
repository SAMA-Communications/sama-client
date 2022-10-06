import BaseApi from "./base/base";

export default class ChatApi extends BaseApi {
  constructor(baseUrl) {
    super(baseUrl);

    this.socket = null;
  }

  async connect() {
    this.socket = new WebSocket(this.baseUrl);

    this.socket.onopen = () => {
      console.log("[socket.open]");
    };

    this.socket.onmessage = (e) => {
      console.log("[socket.message]", e.data);
      // setMessages([...messagesRef.current, e.data]);
    };

    this.socket.onclose = () => {
      console.log("[socket.close]");
    };
  }

  async login(params) {}

  sendMessage(message) {
    this.socket.send(message);
  }
}

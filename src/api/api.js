class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.socket = null;
    this.response = null;
  }

  async connect() {
    this.socket = new WebSocket(this.baseUrl);

    this.socket.onopen = () => {
      console.log("[socket.open]");
    };

    this.socket.onmessage = (e) => {
      console.log("[socket.message]", e.data);
      this.response = JSON.parse(e.data).response;
      // setMessages([...messagesRef.current, e.data]);
    };

    this.socket.onclose = () => {
      console.log("[socket.close]");
    };
  }

  async login(data, onPage) {
    const requstData = {
      request: {
        user_login: {
          login: data.uname,
          password: data.pass,
          deviceId: navigator.productSub,
        },
      },
    };
    this.socket.send(JSON.stringify(requstData));

    if (this.response) {
      localStorage.setItem("token", JSON.parse(this.response.user)._id);
      onPage(true);
    }
  }

  async createUser(data, onPage) {
    const requstData = {
      request: {
        user_create: {
          login: data.uname,
          password: data.pass,
        },
      },
    };
    this.socket.send(JSON.stringify(requstData));
    onPage("login");
  }
}

const api = new Api(process.env.REACT_APP_SOCKET_CONNECT);
api.connect();

export default api;

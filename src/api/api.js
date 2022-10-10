class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.socket = null;
    this.responsesPromises = {};
  }

  async connect() {
    this.socket = new WebSocket(this.baseUrl);

    this.socket.onopen = () => {
      console.log("[socket.open]");
    };

    this.socket.onmessage = (e) => {
      console.log("[socket.message]", e.data);
      const message = JSON.parse(e.data);
      if (message.ask) {
        this.onMessageSent(message.ask.mid, message.ask.t);
        // setMessages([...messagesRef.current, e.data]);
        return;
      }
      const response = message.response;
      if (response) {
        const responseId = response.id;
        const { resolve, reject, resObjKey } =
          this.responsesPromises[responseId];
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response[resObjKey]);
        }
        delete this.responsesPromises[responseId];
      }
    };

    this.socket.onclose = () => {
      console.log("[socket.close]");
    };
  }

  async login(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          user_login: {
            login: data.ulogin,
            password: data.pass,
            deviceId: navigator.productSub,
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "user",
      };

      if (this.responsesPromises[requestData.request.id]) {
        // localStorage.setItem("token", requestData.request.user_login.login);
      }
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async createUser(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          user_create: {
            login: data.ulogin,
            password: data.pass,
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "user",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }
}

function sendMessage(ws, data) {
  ws.send(JSON.stringify(data));
  console.log("[socket.send]", data);
}

const api = new Api(process.env.REACT_APP_SOCKET_CONNECT);
api.connect(); //await?

export default api;

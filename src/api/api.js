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

  async userLogin(data) {
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
        localStorage.setItem("token", requestData.request.user_login.login);
      }
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async userCreate(data) {
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

  async userLogout(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          user_logout: {},
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };

      if (this.responsesPromises[requestData.request.id]) {
        localStorage.removeItem("token");
      }
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async userDelete(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          user_delete: {},
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };

      if (this.responsesPromises[requestData.request.id]) {
        localStorage.removeItem("token");
      }
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async messageCreate(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        message: {
          id: Math.floor(Math.random() * 10001),
          from: "",
          body: "hey how is going?",
          cid: "currentConversationId",
          x: {
            param1: "value",
            param2: "value",
          },
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async messageEdit(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          message_edit: {
            id: "include_2",
            body: "updated message body (UPDATED)",
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async messageList(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          message_edit: {
            cid: "currentConversationId",
            limit: "numberOf",
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "messages",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async messageDelete(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          message_delete: {
            cid: "currentConversationId",
            type: "all",
            ids: ["ids"],
            from: "userId[0]",
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async statusRead(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        read: {
          id: "xyz",
          type: "start",
          mid: "message1234",
          cid: "currentConversationId",
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async statusDelivered(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        delivered: {
          id: "xyz",
          type: "start",
          mid: "message1234",
          cid: "currentConversationId",
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async statusTyping(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        typing: {
          id: "xyz",
          type: "start",
          cid: "currentConversationId",
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async conversationCreate(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          conversation_create: {
            name: data.name,
            description: data.description,
            type: data.type,
            participants: data.participants,
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async conversationUpdate(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          conversation_update: {
            id: "currentConversationId",
            description: "test213",
            participants: {
              add: ["userId[2]"],
              remove: ["userId[2]"],
            },
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async conversationList(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          conversation_list: {
            limit: "numberOf",
            updated_at: {
              gt: "filterUpdatedAt",
            },
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
      };
    }).catch((e) => (err = e));
    return err ? err : promise;
  }

  async conversationDelete(data) {
    let err = undefined;
    const promise = new Promise((resolve, reject) => {
      const requestData = {
        request: {
          conversation_delete: {
            id: "currentConversationId",
          },
          id: Math.floor(Math.random() * 101),
        },
      };

      sendMessage(this.socket, requestData);
      this.responsesPromises[requestData.request.id] = {
        resolve,
        reject,
        resObjKey: "success",
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

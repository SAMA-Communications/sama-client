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
    const resObjKey = "user";
    if (this.responsesPromises[requestData.request.id]) {
      localStorage.setItem("token", requestData.request.user_login.login);
    }
    return await sendPromise(requestData, resObjKey);
  }

  async userCreate(data) {
    const requestData = {
      request: {
        user_create: {
          login: data.ulogin,
          password: data.pass,
        },
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "user";
    return await sendPromise(requestData, resObjKey);
  }

  async userLogout(data) {
    const requestData = {
      request: {
        user_logout: {},
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "success";
    if (this.responsesPromises[requestData.request.id]) {
      localStorage.removeItem("token");
    }
    return await sendPromise(requestData, resObjKey);
  }

  async userDelete(data) {
    const requestData = {
      request: {
        user_delete: {},
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "success";
    if (this.responsesPromises[requestData.request.id]) {
      localStorage.removeItem("token");
    }
    return await sendPromise(requestData, resObjKey);
  }

  async messageCreate(data) {
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
    const resObjKey = "ask"; //???
    return await sendPromise(requestData, resObjKey);
  }

  async messageEdit(data) {
    const requestData = {
      request: {
        message_edit: {
          id: "include_2",
          body: "updated message body (UPDATED)",
        },
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "success";
    return await sendPromise(requestData, resObjKey);
  }

  async messageList(data) {
    const requestData = {
      request: {
        message_edit: {
          cid: "currentConversationId",
          limit: "numberOf",
        },
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "messages";
    return await sendPromise(requestData, resObjKey);
  }

  async messageDelete(data) {
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
    const resObjKey = "success";
    return await sendPromise(requestData, resObjKey);
  }

  async statusRead(data) {
    const requestData = {
      read: {
        id: "xyz",
        type: "start",
        mid: "message1234",
        cid: "currentConversationId",
      },
    };
    const resObjKey = "success";
    return await sendPromise(requestData, resObjKey);
  }

  async statusDelivered(data) {
    const requestData = {
      delivered: {
        id: "xyz",
        type: "start",
        mid: "message1234",
        cid: "currentConversationId",
      },
    };
    const resObjKey = "success";
    return await sendPromise(requestData, resObjKey);
  }

  async statusTyping(data) {
    const requestData = {
      typing: {
        id: "xyz",
        type: "start",
        cid: "currentConversationId",
      },
    };
    const resObjKey = "success";
    return await sendPromise(requestData, resObjKey);
  }

  async conversationCreate(data) {
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
    const resObjKey = "conversation";
    return await sendPromise(requestData, resObjKey);
  }

  async conversationUpdate(data) {
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
    const resObjKey = "conversation";
    return await sendPromise(requestData, resObjKey);
  }

  async conversationList(data) {
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
    const resObjKey = "conversations";
    return await sendPromise(requestData, resObjKey);
  }

  async conversationDelete(data) {
    const requestData = {
      request: {
        conversation_delete: {
          id: "currentConversationId",
        },
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "success";
    return await sendPromise(requestData, resObjKey);
  }
}

async function sendPromise(req, key) {
  let err = undefined;
  const promise = new Promise((resolve, reject) => {
    this.socket.send(JSON.stringify(req));
    console.log("[socket.send]", req);
    this.responsesPromises[req.request.id] = {
      resolve,
      reject,
      resObjKey: key,
    };
  }).catch((e) => (err = e));
  return err ? err : promise;
}

const api = new Api(process.env.REACT_APP_SOCKET_CONNECT);
api.connect(); //await?

export default api;

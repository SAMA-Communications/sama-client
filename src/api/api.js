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
    const response = sendPromise(requestData, resObjKey, this);
    //check error if error => do not save in localStorage
    if (this.responsesPromises[requestData.request.id]) {
      localStorage.setItem("token", requestData.request.user_login.login);
    }
    return response;
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
    return await sendPromise(requestData, resObjKey, this);
  }

  async userLogout(data) {
    const requestData = {
      request: {
        user_logout: {},
        id: Math.floor(Math.random() * 101),
      },
    };
    const resObjKey = "success";
    const response = sendPromise(requestData, resObjKey, this);
    if (this.responsesPromises[requestData.request.id]) {
      localStorage.removeItem("token");
    }
    return response;
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
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
    return await sendPromise(requestData, resObjKey, this);
  }
}

function sendPromise(req, key, ws) {
  let err = undefined;
  const promise = new Promise((resolve, reject) => {
    ws.socket.send(JSON.stringify(req));
    console.log("[socket.send]", req);
    ws.responsesPromises[req.request.id] = {
      resolve,
      reject,
      resObjKey: key,
    };
  }).catch((e) => (err = e));
  const response = err ? err : promise;
  return response;
}

const api = new Api(process.env.REACT_APP_SOCKET_CONNECT);
api.connect(); //await?

export default api;

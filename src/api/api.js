import getUniqueId from "./uuid.js";
//xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx:user_login генерувати
import getBrowserFingerprint from "get-browser-fingerprint";

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
        const mid = message.ask.mid;
        this.responsesPromises[mid](message.ask);
        delete this.responsesPromises[mid];
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

  async sendPromise(req, key) {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify(req));
      console.log("[socket.send]", req);
      this.responsesPromises[req.request.id] = {
        resolve,
        reject,
        resObjKey: key,
      };
    });
  }

  async userLogin(data) {
    const requestData = {
      request: {
        user_login: data.token
          ? {
              token: data.token,
              deviceId: getBrowserFingerprint(true),
            }
          : {
              login: data.ulogin,
              password: data.pass,
              deviceId: getBrowserFingerprint(true),
            },
        id: getUniqueId(data.ulogin),
      },
    };
    const resObjKey = "token";
    return this.sendPromise(requestData, resObjKey);
  }

  async userCreate(data) {
    const requestData = {
      request: {
        user_create: {
          login: data.ulogin,
          password: data.pass,
        },
        id: getUniqueId(data.ulogin),
      },
    };
    const resObjKey = "user";
    return this.sendPromise(requestData, resObjKey);
  }

  async userLogout() {
    const user = getUserLogin();
    const requestData = {
      request: {
        user_logout: {},
        id: getUniqueId(user),
      },
    };
    const resObjKey = "success";
    return this.sendPromise(requestData, resObjKey);
  }

  async userDelete() {
    //only use in app
    const user = getUserLogin();
    const requestData = {
      request: {
        user_delete: {},
        id: getUniqueId(user),
      },
    };
    const resObjKey = "success";
    localStorage.removeItem("sessionId");
    return this.sendPromise(requestData, resObjKey);
  }

  async userSearch(data) {
    const user = getUserLogin();
    const requestData = {
      request: {
        user_search: {
          login: data.login,
          ignore_ids: data.ignore_ids,
        },
        id: getUniqueId(user),
      },
    };
    if (data.limit) requestData.request.user_search["limit"] = data.limit;
    if (data.updated_at)
      requestData.request.user_search["updated_at"] = data.updated_at;
    const resObjKey = "users";
    return this.sendPromise(requestData, resObjKey);
  }

  async getParticipantsByCids(data) {
    const user = getUserLogin();
    const requestData = {
      request: {
        getParticipantsByCids: {
          cids: [...data.cids],
        },
        id: getUniqueId(user),
      },
    };
    const resObjKey = "participants";
    return this.sendPromise(requestData, resObjKey);
  }

  async messageCreate(data) {
    return new Promise((resolve, reject) => {
      const requestData = {
        message: {
          id: getUniqueId(getUserLogin()),
          body: data.text,
          cid: data.chatId,
          // x: {
          //   param1: "value",
          //   param2: "value",
          // },
        },
      };
      this.responsesPromises[requestData.message.id] = resolve;
      this.socket.send(JSON.stringify(requestData));
      console.log("[socket.send]", requestData);
    });
  }

  async messageEdit(data) {
    //===============to do
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
    return this.sendPromise(requestData, resObjKey);
  }

  async messageList(data) {
    const user = getUserLogin();
    const requestData = {
      request: {
        message_list: {
          cid: data.cid,
        },
        id: getUniqueId(user),
      },
    };
    if (data.limit) requestData.request.message_list["limit"] = data.limit;

    const resObjKey = "messages";
    return this.sendPromise(requestData, resObjKey);
  }

  async messageDelete(data) {
    //===============to do
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
    return this.sendPromise(requestData, resObjKey);
  }

  async statusRead(data) {
    //===============to do
    const requestData = {
      read: {
        id: "xyz",
        type: "start",
        mid: "message1234",
        cid: "currentConversationId",
      },
    };
    const resObjKey = "success";
    return this.sendPromise(requestData, resObjKey);
  }

  async statusDelivered(data) {
    //===============to do
    const requestData = {
      delivered: {
        id: "xyz",
        type: "start",
        mid: "message1234",
        cid: "currentConversationId",
      },
    };
    const resObjKey = "success";
    return this.sendPromise(requestData, resObjKey);
  }

  async statusTyping(data) {
    //===============to do
    const requestData = {
      typing: {
        id: "xyz",
        type: "start",
        cid: "currentConversationId",
      },
    };
    const resObjKey = "success";
    return this.sendPromise(requestData, resObjKey);
  }

  async conversationCreate(data) {
    const user = getUserLogin();
    const requestData = {
      request: {
        conversation_create: {
          name: data.name,
          description: data.description,
          type: data.type,
          opponent_id: data.opponent_id,
          participants: data.participants,
        },
        id: getUniqueId(user),
      },
    };
    const resObjKey = "conversation";
    return this.sendPromise(requestData, resObjKey);
  }

  async conversationUpdate(data) {
    //===============to do
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
    return this.sendPromise(requestData, resObjKey);
  }

  async conversationList(data) {
    const user = getUserLogin();
    const requestData = {
      request: {
        conversation_list: {},
        id: getUniqueId(user),
      },
    };
    if (data.limit) requestData.request.conversation_list["limit"] = data.limit;
    if (data.updated_at)
      requestData.request.conversation_list["updated_at"]["gt"] =
        data.updated_at;
    const resObjKey = "conversations";
    return this.sendPromise(requestData, resObjKey);
  }

  async conversationDelete(data) {
    const user = getUserLogin();
    const requestData = {
      request: {
        conversation_delete: {
          id: data.cid,
        },
        id: getUniqueId(user),
      },
    };
    const resObjKey = "success";
    return this.sendPromise(requestData, resObjKey);
  }
}

function getUserLogin() {
  let token = localStorage.getItem("sessionId");
  token = token ? token.split(".")[1] : token;
  return token ? token.split(0, 6) : token;
}

const api = new Api(process.env.REACT_APP_SOCKET_CONNECT);
api.connect();

export { getUserLogin };
export default api;

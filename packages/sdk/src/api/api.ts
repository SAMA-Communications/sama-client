import getBrowserFingerprint from "get-browser-fingerprint";
import getUniqueId from "../utils/uuid";
import { ISocketRequest, IMessage, IConversation, IUser, IFile, ISubscription, IResponsePromise } from "../types"

class SAMAClient {
  private socket: WebSocket | null = null;
  private wsEndpoint: string;
  private httpEndpoint: string;
  private organizationId: string;
  private curerntUserId: string | null = null;
  private responsesPromises: Record<string, IResponsePromise> = {};
  private deviceId: string | null = null;

  public onMessageListener: ((message: IMessage) => void) | null = null;
  public onMessageEditListener?: ((messageEdit: any) => void);
  public onMessageDeleteListener?: ((messageDelete: any) => void);
  public onMessageStatusListener: ((status: any) => void) | null = null;
  public onUserActivityListener: ((activity: any) => void) | null = null;
  public onUserTypingListener: ((typing: any) => void) | null = null;
  public onConversationCreateListener: ((conversation: IConversation) => void) | null = null;
  public onConversationUpdateListener: ((conversation: IConversation) => void) | null = null;
  public onConversationDeleteListener: ((conversationId: string) => void) | null = null;

  public onConnectEvent: (() => void) | null = null;
  public onMessageEvent: ((message: IMessage) => void) | null = null;
  public onDisconnectEvent: (() => void) | null = null;

  constructor({ endpoint: { ws, http }, organization_id }: { endpoint: { ws: string; http: string }, organization_id: string }) {
    this.wsEndpoint = ws;
    this.httpEndpoint = http;
    this.organizationId = organization_id;
    getBrowserFingerprint({ hardwareOnly: true }).then((device_id) => (this.deviceId = device_id.toString()));
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.wsEndpoint);

      this.socket.onopen = () => {
        console.log("[socket.open]");
        this.onConnectEvent?.();
        resolve();
      };

      this.socket.onmessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        console.log("[socket.message]", message);

        if (message.typing) {
          this.onUserTypingListener?.(message.typing);
          return;
        }

        if (message.system_message || message.message?.system_message) {
          const { conversation_created, conversation_updated, conversation_kicked } = message.system_message?.x || message.message?.system_message?.x || {};

          if (conversation_created) {
            this.onConversationCreateListener?.(conversation_created);
            return;
          }
          if (conversation_updated) {
            this.onConversationUpdateListener?.(conversation_updated);
            return;
          }
          if (conversation_kicked) {
            this.onConversationDeleteListener?.(conversation_kicked);
            return;
          }
          return;
        }

        if (message.last_activity) {
          this.onUserActivityListener?.(message.last_activity);
          return;
        }

        if (message.message_read) {
          this.onMessageStatusListener?.(message.message_read);
          return;
        }

        if (message.message_edit) {
          this.onMessageEditListener?.(message.message_edit)
          return
        }

        if (message.message_delete) {
          this.onMessageDeleteListener?.(message.message_delete)
          return
        }

        if (message.message) {
          if (message.message.error) {
            this.responsesPromises[Object.keys(this.responsesPromises).slice(-1)[0]].reject(message.message.error);
            return;
          }
          this.onMessageListener?.(message.message);
          if (message.message.from.toString() !== this.curerntUserId) {
            this.onMessageEvent?.(message.message);
          }
          return;
        }

        if (message.ask) {
          const mid = message.ask.mid;
          this.responsesPromises[mid].resolve(message.ask);
          delete this.responsesPromises[mid];
          return;
        }

        const response = message.response;
        if (response) {
          const responseId = response.id;

          if (!responseId) {
            console.error(response.error);
            return;
          }

          const { resolve, reject, resObjKey } = this.responsesPromises[responseId];

          if (response.error) {
            response.error.status === 403 ? this.responsesPromises[responseId].reject(response.error) : reject(response.error);
          } else {
            if (Array.isArray(resObjKey)) {
              const result = resObjKey.reduce<Record<string, any>>((acc, key) => {
                response[key] !== undefined && (acc[key] = response[key]);
                return acc;
              }, {});
              resObjKey.every(key => key in result) ? resolve(result) : reject({ message: "Server error." });
            } else if (resObjKey) {
              response[resObjKey] ? resolve(response[resObjKey]) : reject({ message: "Server error." });
            } else {
              resolve(response);
            }
          }
          delete this.responsesPromises[responseId];
        }
      };

      this.socket.onerror = (error) => {
        console.log("[socket.error]", error);
        reject(error);
      };

      this.socket.onclose = () => {
        console.log("[socket.close]");
        this.onDisconnectEvent?.();
        this.reconnect();

      };
    });
  }

  private reconnect() {
    const reConnect = () => {
      if (navigator.onLine && document.visibilityState === "visible") {
        this.connect();
        window.removeEventListener("online", reConnect);
        document.removeEventListener("visibilitychange", reConnect);
      }
    };

    if (navigator.onLine && document.visibilityState === "visible") {
      this.connect();
    } else {
      window.addEventListener("online", reConnect);
      document.addEventListener("visibilitychange", reConnect);
    }
  }

  private async sendRequest<T>(action: string, data: any = {}, resObjKey: string | string[] = "success"): Promise<T> {
    const requestData = {
      request: {
        [action]: data,
        id: getUniqueId(action),
      },
    };
    return this.sendPromise(requestData, resObjKey);
  }

  private async sendPromise<T>(req: ISocketRequest<any>, key: string | string[]): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket is not connected.");
        return;
      }

      this.socket.send(JSON.stringify(req));
      console.log("[socket.send]", req);

      this.responsesPromises[req.request.id] = { resolve, reject, resObjKey: key, };
    });
  }


  private async sendHttpPromise(method: string, endpoint: string, data: any): Promise<any> {
    console.log("[http.request]", { request: data });
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const accessToken = localStorage.getItem("sessionId");
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const params: RequestInit = {
      method,
      credentials: "include",
      headers,
    };
    if (data) params.body = JSON.stringify(data);

    const response = await fetch(`${this.httpEndpoint}/${endpoint}`, params);

    const text = await response.text();
    if (!response.ok) {
      console.error("[http.error]", text);
      throw text || response.statusText;
    }

    const responseData = text ? JSON.parse(text) : {};
    console.log("[http.response]", { response: responseData });

    return responseData;
  }

  async connectSocket(data: { token: string; deviceId: string }): Promise<any> {
    return this.sendRequest("connect", { token: data.token, device_id: this.deviceId });
  }

  async disconnectSocket(): Promise<any> {
    return this.sendRequest("user_logout");
  }

  async userCreate(data: { login: string; email: string; password: string }): Promise<IUser> {
    return this.sendRequest("user_create", { organization_id: this.organizationId, login: data.login, email: data.email, password: data.password }, "user");
  }

  async userEdit(data: { [key: string]: any }): Promise<IUser> {
    return this.sendRequest("user_edit", data, "user");
  }

  async userLogin(data: { login?: string; password?: string }): Promise<any> {
    const { login, password } = data || {};

    const currentTime = Date.now();
    const tokenExpiredAt = parseInt(localStorage.getItem("sessionExpiredAt") || `${currentTime}`, 10);
    if (tokenExpiredAt - currentTime <= 0) localStorage.removeItem("sessionId");

    const requestData: { organization_id: string, device_id: string | null; login?: string; password?: string } = { organization_id: this.organizationId, device_id: this.deviceId };
    if (login && password) {
      requestData.login = login;
      requestData.password = password;
    }

    return await this.sendHttpPromise("POST", "login", requestData);
  }

  async userLogout(): Promise<any> {
    return await this.sendHttpPromise("POST", "logout", null);
  }

  async userSendOTPToken(data: { email: string }): Promise<any> {
    const requestData: { organization_id: string, device_id: string | null; email: string; } = { organization_id: this.organizationId, device_id: this.deviceId, email: data.email };

    return this.sendRequest("user_send_otp", requestData);
  }

  async userResetPassword(data: { email: string, token: number, new_password: string }): Promise<any> {
    const requestData: { organization_id: string, device_id: string | null; email: string; token: number; new_password: string } = { organization_id: this.organizationId, device_id: this.deviceId, email: data.email, token: data.token, new_password: data.new_password };

    return this.sendRequest("user_reset_password", requestData);
  }

  async userDelete(): Promise<any> {
    localStorage.removeItem("sessionId");
    return this.sendRequest("user_delete");
  }

  async userSearch(data: { keyword: string; ignore_ids?: string[]; limit?: number; updated_at?: string }): Promise<IUser[]> {
    const searchParams = {
      keyword: data.keyword,
      ignore_ids: data.ignore_ids || [],
      ...(data.limit && { limit: data.limit }),
      ...(data.updated_at && { updated_at: data.updated_at }),
    };
    return this.sendRequest("user_search", searchParams, "users");
  }

  async getUsersByIds(data: { ids: string[] }): Promise<IUser[]> {
    return this.sendRequest("get_users_by_ids", { ids: data.ids }, "users");
  }

  async getParticipantsByCids(data: { cids: string[] }): Promise<IUser[]> {
    return this.sendRequest("get_participants_by_cids", { cids: data.cids }, ["users", "conversations"]);
  }

  async createUploadUrlForFiles(data: { files: any[] }): Promise<IFile[]> {
    return this.sendRequest("create_files", data.files, "files");
  }

  async getDownloadUrlForFiles(data: { file_ids: string[] }): Promise<string[]> {
    return this.sendRequest("get_file_urls", { file_ids: data.file_ids }, "file_urls");
  }

  async messageCreate(data: { mid: string; body: string; cid: string; attachments?: any[], replied_message_id: string, forwarded_message_id: string }): Promise<IMessage> {
    return new Promise((resolve, reject) => {
      const requestData = {
        message: {
          id: data.mid,
          body: data.body,
          cid: data.cid,
          attachments: data.attachments,
          replied_message_id: data.replied_message_id,
          forwarded_message_id: data.forwarded_message_id
        },
      };
      this.responsesPromises[requestData.message.id] = { resolve, reject };
      this.socket?.send(JSON.stringify(requestData));
      console.log("[socket.send]", requestData);
    });
  }

  async messageEdit(data: { mid: string, body: string }): Promise<any> {
    return this.sendRequest("message_edit", { id: data.mid, body: data.body });
  }

  async messageDelete(data: { cid: string, mids?: string[], type?: string }): Promise<any> {
    return this.sendRequest("message_delete", { cid: data.cid, ids: data.mids, type: data.type ?? "myself" });
  }

  async messageList(data: { cid: string; ids?: string[]; limit?: number; updated_at?: string }): Promise<IMessage[]> {
    const messageParams = {
      cid: data.cid,
      ...(data.ids && { ids: data.ids }),
      ...(data.limit && { limit: data.limit }),
      ...(data.updated_at && { updated_at: data.updated_at }),
    };
    return this.sendRequest("message_list", messageParams, "messages");
  }

  async messageSummary(data: { cid: string, filter: string }): Promise<any> {
    return this.sendRequest("message_summary", { cid: data.cid, filter: data.filter }, "message");
  }

  async messageTone(data: { body: string, tone: string }): Promise<any> {
    return this.sendRequest("message_tone", { body: data.body, tone: data.tone }, "message");
  }

  async markConversationAsRead(data: { cid: string }): Promise<any> {
    return this.sendRequest("message_read", { cid: data.cid });
  }

  async subscribeToUserActivity(data: string): Promise<any> {
    return this.sendRequest("user_last_activity_subscribe", { id: data }, "last_activity");
  }

  async unsubscribeFromUserActivity(): Promise<any> {
    return this.sendRequest("user_last_activity_unsubscribe");
  }

  async sendTypingStatus(data: { cid: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestData = { typing: { cid: data.cid } };
      this.responsesPromises[requestData.typing.cid] = { resolve, reject };
      this.socket?.send(JSON.stringify(requestData));
      console.log("[socket.send]", requestData);
    });
  }

  async conversationCreate(data: { name: string; description?: string; participants?: string[] }): Promise<IConversation> {
    return this.sendRequest("conversation_create", data, "conversation");
  }

  async conversationUpdate(data: { cid: string; name?: string; description?: string; participants?: { add?: string[]; remove?: string[] }; image_object?: any }): Promise<IConversation> {
    return this.sendRequest("conversation_update", {
      id: data.cid,
      name: data.name,
      description: data.description,
      participants: {
        add: data.participants?.add,
        remove: data.participants?.remove,
      },
      image_object: data.image_object,
    }, "conversation");
  }

  async conversationList(data: { limit?: number; updated_at?: { gt?: string, lt?: string } }): Promise<IConversation[]> {
    const listParams = {
      ...(data.limit && { limit: data.limit }),
      ...(data.updated_at && { updated_at: { gt: data.updated_at.gt, lt: data.updated_at.lt } }),
    };
    return this.sendRequest("conversation_list", listParams, "conversations");
  }

  async conversationDelete(data: { cid: string }): Promise<any> {
    return this.sendRequest("conversation_delete", { id: data.cid });
  }

  async conversationSearch(data: { name: string }): Promise<IConversation[]> {
    return this.sendRequest("conversation_search", { name: data.name }, "conversations");
  }

  async conversationHandlerCreate(data: { cid: string, content: string }): Promise<any> {
    return this.sendRequest("conversation_handler_create", { cid: data.cid, content: data.content });
  }

  async getConversationHandler(data: { cid: string }): Promise<any> {
    return this.sendRequest("get_conversation_handler", { cid: data.cid }, "conversation_handler");
  }

  async conversationHandlerDelete(data: { cid: string }): Promise<any> {
    return this.sendRequest("conversation_handler_delete", { cid: data.cid });
  }

  async pushSubscriptionCreate(data: { web_endpoint: string; web_key_auth: string; web_key_p256dh: string }): Promise<ISubscription> {
    return this.sendRequest("push_subscription_create", {
      platform: "web",
      web_endpoint: data.web_endpoint,
      web_key_auth: data.web_key_auth,
      web_key_p256dh: data.web_key_p256dh,
      device_udid: this.deviceId,
    }, "subscription");
  }

  async pushSubscriptionDelete(): Promise<any> {
    return this.sendRequest("push_subscription_delete", { device_udid: this.deviceId });
  }
}

export default SAMAClient;
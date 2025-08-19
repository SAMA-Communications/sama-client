import getUniqueId from "../utils/uuid";
import WebSocketImp from "../utils/websocket";
import { ISocketRequest, UserId, IMessageCreateAck, IMessage, IConversation, IUser, IFile, ISubscription, IResponsePromise } from "../types"

class SAMAClient {
  private socket?: WebSocket;
  private wsEndpoint: string;
  private httpEndpoint: string;
  private organizationId: string;
  private currentUserId?: string;
  private responsesPromises: Record<string, IResponsePromise> = {};
  public deviceId?: string;

  public onMessageListener?: ((message: IMessage) => void);
  public onMessageStatusListener?: ((status: any) => void)
  public onMessageEditListener?: ((messageEdit: any) => void);
  public onMessageDeleteListener?: ((messageDelete: any) => void);
  public onMessageReactionsListener?: ((messageReactions: any) => void);

  public onUserActivityListener?: ((activity: any) => void);
  public onUserTypingListener?: ((typing: any) => void);

  public onConversationCreateListener?: ((conversation: IConversation) => void);
  public onConversationUpdateListener?: ((conversation: IConversation) => void);
  public onConversationDeleteListener?: ((conversationId: string) => void);

  public onConnectEvent?: (() => void);
  public onMessageEvent?: ((message: IMessage) => void);
  public onSystemMessageEvent?: ((message: IMessage) => void);
  public onDisconnectEvent?: (() => void);

  constructor(
    { endpoint: { ws, http }, organization_id }
    : { endpoint: { ws: string; http: string }, organization_id: string }
  ) {
    this.wsEndpoint = ws;
    this.httpEndpoint = http;
    this.organizationId = organization_id;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocketImp(this.wsEndpoint);

      this.socket.onopen = () => {
        console.log("[socket.open]");
        this.onConnectEvent?.();
        resolve();
      };

      this.socket.onmessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        this.onMessageListener?.(message);

        console.log("[socket.message]", message);

        if (message.typing) {
          this.onUserTypingListener?.(message.typing);
          return;
        }

        if (message.system_message || message.message?.system_message) {
          const systemMessage = message.system_message ?? message.message?.system_message
          const { conversation_created, conversation_updated, conversation_kicked } = systemMessage?.x ?? {};

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

          this.onSystemMessageEvent?.(systemMessage)
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

        if (message.message_reactions_update) {
          this.onMessageReactionsListener?.(message.message_reactions_update)

          return
        }

        if (message.message) {
          if (message.message.error) {
            this.responsesPromises[Object.keys(this.responsesPromises).slice(-1)[0]].reject(message.message.error);
            return;
          }
          if (message.message.from.toString() !== this.currentUserId) {
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
      };
    });
  }

  public async disconnect(): Promise<void> {
    return this.socket?.close()
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

  async socketLogin(data: { user: { userId: UserId, login: string, password: string, }, deviceId?: string, token?: string }): Promise<any> {
    return this.sendRequest("user_login", { organization_id: this.organizationId, ...data.user, device_id: data.deviceId ?? this.deviceId, token: data.token }, "user");
  }

  async connectSocket(data: { token: string; deviceId: string }): Promise<any> {
    return this.sendRequest("connect", { token: data.token, device_id: data.deviceId ?? this.deviceId });
  }

  async disconnectSocket(): Promise<any> {
    return this.sendRequest("user_logout");
  }

  async userCreate(data: { login: string; password: string }): Promise<IUser> {
    return this.sendRequest("user_create", { organization_id: this.organizationId, login: data.login, password: data.password }, "user");
  }

  async userEdit(data: { [key: string]: any }): Promise<IUser> {
    return this.sendRequest("user_edit", data, "user");
  }

  async userLogin(data: { login?: string; password?: string }): Promise<any> {
    const { login, password } = data || {};

    const currentTime = Date.now();
    const tokenExpiredAt = parseInt(localStorage.getItem("sessionExpiredAt") || `${currentTime}`, 10);
    if (tokenExpiredAt - currentTime <= 0) localStorage.removeItem("sessionId");

    const requestData: { organization_id: string, device_id?: string; login?: string; password?: string } = { organization_id: this.organizationId, device_id: this.deviceId };
    if (login && password) {
      requestData.login = login;
      requestData.password = password;
    }

    return await this.sendHttpPromise("POST", "login", requestData);
  }

  async userLogout(): Promise<any> {
    return await this.sendHttpPromise("POST", "logout", null);
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

  async messageCreate(data: { mid: string; body: string; cid: string; x?: { [key: string]: any }, attachments?: any[], replied_message_id: string }): Promise<IMessageCreateAck> {
    return new Promise((resolve, reject) => {
      const requestData = {
        message: {
          id: data.mid,
          body: data.body,
          cid: data.cid,
          x: data.x,
          attachments: data.attachments,
          replied_message_id: data.replied_message_id
        },
      };
      this.responsesPromises[requestData.message.id] = { resolve, reject };
      this.socket?.send(JSON.stringify(requestData));
      console.log("[socket.send]", requestData);
    });
  }

  async messageSystem(data: { mid: string; uids?: string[], cid?: string; x: { [key: string]: any }}): Promise<IMessageCreateAck> {
    return new Promise((resolve, reject) => {
      const requestData = {
        system_message: {
          id: data.mid,
          uids: data.uids,
          cid: data.cid,
          x: data.x
        },
      };
      this.responsesPromises[requestData.system_message.id] = { resolve, reject };
      this.socket?.send(JSON.stringify(requestData));
      console.log("[socket.send]", requestData);
    });
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
  
  async markConversationAsRead(data: { cid: string, mids?: string[] }): Promise<any> {
    return this.sendRequest("message_read", { cid: data.cid, ids: data.mids });
  }

  async messageEdit(data: { mid: string, body: string }): Promise<any> {
    return this.sendRequest("message_edit", { id: data.mid, body: data.body });
  }

  async messageDelete(data: { cid: string, mids?: string[], type?: string }): Promise<any> {
    return this.sendRequest("message_delete", { cid: data.cid, ids: data.mids, type: data.type ?? "myself" });
  }

  async getUserActivity(userIds: UserId[]): Promise<any> {
    return this.sendRequest("user_last_activity", { ids: userIds }, "last_activity");
  }

  async subscribeToUserActivity(data: UserId): Promise<any> {
    return this.sendRequest("user_last_activity_subscribe", { id: data }, "last_activity");
  }

  async unsubscribeFromUserActivity(): Promise<any> {
    return this.sendRequest("user_last_activity_unsubscribe");
  }

  async sendTypingStatus(data: { cid: string, status?: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      const requestData = { typing: { cid: data.cid, status: data.status } };
      this.socket?.send(JSON.stringify(requestData));
      console.log("[socket.send]", requestData);
      resolve();
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

  async ping(): Promise<any> {
    return this.sendRequest("ping", {}, "pong")
  }

  async setActivityStatus(isInactive: boolean): Promise<any> {
    return this.sendRequest("activity_status", { isInactive: !!isInactive }, "success")
  }

  async blockList(): Promise<UserId[]> {
    return this.sendRequest("list_blocked_users", {}, "users")
  }

  async blockUsers(users: UserId[]): Promise<void> {
    return this.sendRequest("block_user", { ids: users }, "success")
  }

  async unblockUsers(users: UserId[]): Promise<void> {
    return this.sendRequest("unblock_user", { ids: users }, "success")
  }

  async reactionsUpdate(mid: string, addReaction?: string, removeReaction?: string): Promise<void> {
    return this.sendRequest("message_reactions_update", { mid, add: addReaction, remove: removeReaction }, "success")
  }

  async reactionsList(mid: string): Promise<void> {
    return this.sendRequest("message_reactions_list", { mid }, "reactions")
  }
}

export default SAMAClient;

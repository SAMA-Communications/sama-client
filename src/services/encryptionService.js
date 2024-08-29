import api from "@api/api";
import initVodozemac, { Account, Session } from "vodozemac-javascript";
import store from "@src/store/store";
import { insertChat } from "@src/store/values/Conversations";
import { setEncryptedUser } from "@store/values/EncryptedUser";
import { setSelectedConversation } from "@src/store/values/SelectedConversation";
import { upsertUser } from "@src/store/values/Participants";

class EncryptionService {
  encryptionSession = null;
  account = null;

  constructor() {
    initVodozemac().then(() => {
      console.log("[encryption] Vodozemac init Ok");
    });
  }

  #getAccount() {
    if (this.account) {
      return this.account;
    }

    this.account = new Account();

    return this.account;
  }

  async registerDevice() {
    const user = this.#getAccount();
    user.generate_one_time_keys(50);

    setEncryptedUser(user);

    const data = {
      identity_key: user.curve25519_key,
      signed_key: user.ed25519_key,
      one_time_pre_keys: Object.fromEntries(user.one_time_keys.entries()),
    };
    await api.encryptedDeviceCreate(data);
  }

  async createEncryptedChat(userId) {
    console.log("Encryprion: createEncryptedChat ");

    if (!userId) {
      return;
    }

    const requestData = {
      type: "u",
      participants: [userId],
      is_encrypted: true,
    };

    const chat = await api.conversationCreate(requestData);
    store.dispatch(insertChat({ ...chat, messagesIds: null }));
    store.dispatch(setSelectedConversation({ id: chat._id }));

    return chat._id;
  }

  async #getParticipantsKeys(user_id) {
    const usersKeys = await api.getEncryptedKeys({ user_ids: [user_id] });
    const keys = usersKeys[user_id]?.[0];

    store.dispatch(
      upsertUser({
        _id: user_id,
        keys,
      })
    );

    return keys;
  }

  async createEncryptionSession(userId) {
    console.log(userId, this.account);

    const userKeys = await this.#getParticipantsKeys(userId);
    console.log(userKeys);
    if (!userKeys) {
      console.log("Encryption: opponent offline");

      return;
    }

    const session = this.account.create_outbound_session(
      userKeys.identity_key,
      userKeys.one_time_pre_keys
    );
    this.encryptionSession = session;
    console.log(session);
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

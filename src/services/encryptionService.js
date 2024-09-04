import EncodeText from "@utils/user/encode_text";
import api from "@api/api";
import initVodozemac, { Account } from "vodozemac-javascript";
import localforage from "localforage";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { insertChat } from "@store/values/Conversations";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { upsertUser } from "@store/values/Participants";

class EncryptionService {
  encryptionSession = null;
  account = null;
  chatIdAfterRegister = null;

  constructor() {
    initVodozemac().then(() => {
      console.log("[encryption] Vodozemac init Ok");
    });
  }

  setChatIdAfterRegister(id) {
    this.chatIdAfterRegister = id;
  }

  validateIsAuthEncrypted() {
    return !!this.account;
  }

  async #getAccount(password) {
    if (this.account) {
      return this.account;
    }

    const key = (await EncodeText(password)).slice(0, 32);

    const encAuthKey = await localforage.getItem("account");

    if (encAuthKey) {
      try {
        this.account = Account.from_pickle(encAuthKey, key);
      } catch (error) {
        localforage.removeItem("account");
        showCustomAlert("Account session has expired. Try again.");
        return null;
      }
      return this.account;
    }

    this.account = new Account();
    const encryptedKey = this.account.pickle(key);
    localforage.setItem("account", encryptedKey);

    return this.account;
  }

  async registerDevice(password) {
    const user = await this.#getAccount(password);
    user.generate_one_time_keys(50);

    console.log("Encryption: ", user);

    const data = {
      identity_key: user.curve25519_key,
      signed_key: user.ed25519_key,
      one_time_pre_keys: Object.fromEntries(user.one_time_keys.entries()),
    };
    await api.encryptedDeviceCreate(data);

    if (this.chatIdAfterRegister) {
      navigateTo(`/#${this.chatIdAfterRegister}`);
      store.dispatch(setSelectedConversation(this.chatIdAfterRegister));
    }
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
    console.log("Ecnrypted opponet keys: ", userKeys);
    if (!userKeys) {
      console.log("Encryption: opponent offline");
      return null;
    }

    const session = this.account.create_outbound_session(
      userKeys.identity_key,
      userKeys.one_time_pre_keys
    );
    this.encryptionSession = session;

    console.log("Ecnrypted session: ", session);

    return this.encryptionSession;
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

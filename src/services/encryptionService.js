import EncodeText from "@utils/user/encode_text";
import api from "@api/api";
import initVodozemac, { Account } from "vodozemac-javascript";
import localforage from "localforage";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { insertChat } from "@store/values/Conversations";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { addUsers, upsertUser } from "@store/values/Participants";

class EncryptionService {
  #encryptionSession = null;
  #account = null;
  #chatIdAfterRegister = null;
  #vodozemacInitialized = false;

  constructor() {
    this.#initializeVodozemac();
  }

  async #initializeVodozemac() {
    try {
      await initVodozemac();
      this.#vodozemacInitialized = true;
      console.log("[encryption] Vodozemac initialized successfully");
    } catch (error) {
      console.error("[encryption] Failed to initialize Vodozemac", error);
      showCustomAlert(
        "Failed to initialize encryption. Please reload the app."
      );
    }
  }

  setChatIdAfterRegister(id) {
    this.#chatIdAfterRegister = id;
  }

  validateIsUserAuth() {
    return !!this.#account;
  }

  async #getAccount(password) {
    if (this.#account) {
      return this.#account;
    }

    const key = (await EncodeText(password)).slice(0, 32);
    const encAuthKey = await localforage.getItem("account");

    if (encAuthKey) {
      try {
        this.#account = Account.from_pickle(encAuthKey, key);
      } catch (error) {
        await localforage.removeItem("account");
        console.error("[encryption] Account session expired", error);
        showCustomAlert("Account session has expired. Please log in again.");
        return null;
      }
    } else {
      this.#account = new Account();
      const encryptedKey = this.#account.pickle(key);
      localforage.setItem("account", encryptedKey);
    }
    return this.#account;
  }

  async logout() {
    this.#account = null;
  }

  async registerDevice(password) {
    const user = await this.#getAccount(password);
    if (!user) return;

    user.generate_one_time_keys(50);
    console.log("Encryption: User account generated", user);

    const data = {
      identity_key: user.curve25519_key,
      signed_key: user.ed25519_key,
      one_time_pre_keys: Object.fromEntries(user.one_time_keys.entries()),
    };

    try {
      await api.encryptedDeviceCreate(data);
      if (this.#chatIdAfterRegister) {
        navigateTo(`/#${this.#chatIdAfterRegister}`);
        store.dispatch(
          setSelectedConversation({ id: this.#chatIdAfterRegister })
        );
      }
    } catch (error) {
      console.error("[encryption] Failed to register device", error);
    }
  }

  async createEncryptedChat(userId, userObject) {
    console.log("Encryprion: createEncryptedChat ");

    if (!userId) {
      console.error("[encryption] User ID is required to create a chat");
      return;
    }

    const requestData = {
      type: "u",
      participants: [userId],
      is_encrypted: true,
    };

    try {
      const chat = await api.conversationCreate(requestData);
      userObject && store.dispatch(addUsers([userObject]));
      store.dispatch(insertChat({ ...chat, messagesIds: null }));
      return chat._id;
    } catch (error) {
      console.error("[encryption] Failed to create encrypted chat", error);
      return null;
    }
  }

  async #getParticipantsKeys(userId) {
    try {
      const usersKeys = await api.getEncryptedKeys({ user_ids: [userId] });
      const keys = usersKeys[userId]?.[0];

      if (keys) {
        store.dispatch(upsertUser({ _id: userId, keys }));
      } else {
        console.error("[encryption] No keys found for the user", userId);
      }

      return keys;
    } catch (error) {
      console.error("[encryption] Failed to get participant's keys", error);
      return null;
    }
  }

  async createEncryptionSession(userId) {
    if (!this.#vodozemacInitialized || !this.#account) {
      console.error("[encryption] Service or account not initialized");
      return null;
    }

    const userKeys = await this.#getParticipantsKeys(userId);
    if (!userKeys) {
      console.error("[encryption] Could not retrieve opponent's keys");
      return null;
    }

    try {
      const session = this.#account.create_outbound_session(
        userKeys.identity_key,
        userKeys.one_time_pre_keys
      );
      this.#encryptionSession = session;
      store.dispatch(
        setSelectedConversation({ id: this.#chatIdAfterRegister })
      );
      console.log("Encrypted session created:", session);
      return this.#encryptionSession;
    } catch (error) {
      console.error("[encryption] Failed to create encryption session", error);
      return null;
    }
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

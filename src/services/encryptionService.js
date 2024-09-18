import api from "@api/api";
import createHash from "@utils/user/create_hash";
import initVodozemac, { Account, OlmMessage } from "vodozemac-javascript";
import localforage from "localforage";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { upsertUser } from "@store/values/Participants";

class EncryptionService {
  #encryptionSessions = {};
  #account = null;
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
    }
    this.testVodozemac();
  }

  testVodozemac() {
    const a1 = new Account();
    a1.generate_one_time_keys(1);

    const b1 = new Account();
    b1.generate_one_time_keys(1);

    console.log(a1, b1);

    const a1_session = a1.create_outbound_session(
      b1.curve25519_key,
      b1.one_time_keys.get("AAAAAAAAAAA")
    );

    console.log(a1_session);

    const olmMessage = a1_session.encrypt("test_message");

    console.log(olmMessage);

    const newOlmMessage = new OlmMessage(
      olmMessage.message_type,
      olmMessage.ciphertext
    );

    console.log(newOlmMessage);

    const b1_session = b1.create_inbound_session(
      a1.curve25519_key,
      newOlmMessage
    );

    console.log(b1_session);
  }

  hasAccount() {
    return !!this.#account;
  }

  async hasStoredAccount() {
    return !!(await localforage.getItem("account"));
  }

  async clearStoredAccount() {
    this.#account = null;
    await localforage.removeItem("account");
  }

  async encryptMessage(text, userId) {
    const session = this.#encryptionSessions[userId];
    console.log(session);

    const olmMessage = session.encrypt(text);

    console.log(olmMessage);
    console.log(JSON.stringify(olmMessage));

    return olmMessage;
  }

  async decryptMessage(text, type = 0, userId) {
    console.log(text, type, userId);

    const session = this.#encryptionSessions[userId];
    console.log(type, text);

    const olmMessage = new OlmMessage(type, text);

    const dencryptedMessage = session.decrypt(olmMessage);
    console.log(dencryptedMessage);

    return dencryptedMessage;
  }

  async #getAccount(lockPassword) {
    if (this.#account) {
      return this.#account;
    }

    const key = (await createHash(lockPassword)).slice(0, 32);
    const encAuthKey = await localforage.getItem("account");

    let isNewAccount = false;
    if (encAuthKey) {
      try {
        this.#account = Account.from_pickle(encAuthKey, key);
      } catch (error) {
        showCustomAlert("Incorrect key. Please try again.");
        throw new Error("[encryption] Incorrect key.");
      }
    } else {
      this.#account = new Account();
      isNewAccount = true;
      const encryptedKey = this.#account.pickle(key);
      localforage.setItem("account", encryptedKey);
    }
    return { account: this.#account, isNewAccount };
  }

  async registerDevice(lockPassword) {
    const { account, isNewAccount } = await this.#getAccount(lockPassword);

    if (!account) return;
    if (!isNewAccount) return { isSuccessAuth: true };

    account.generate_one_time_keys(1);
    console.log("Encryption: User account generated", account);

    const data = {
      identity_key: account.curve25519_key,
      signed_key: account.ed25519_key,
      one_time_pre_keys: Object.fromEntries(account.one_time_keys.entries()),
    };
    console.log(account, data);

    try {
      await api.encryptedDeviceCreate(data);
      // account.mark_keys_as_published();
      return { isSuccessAuth: true };
    } catch (error) {
      console.error("[encryption] Failed to register device", error);
      return { isSuccessAuth: false };
    }
  }

  async #getUserKeys(userId) {
    try {
      const usersKeys = await api.getEncryptedKeys({ user_ids: [userId] });
      console.log(usersKeys);
      const keys = usersKeys[userId]?.[0];

      if (keys) {
        store.dispatch(upsertUser({ _id: userId, keys }));
      } else {
        console.error("[encryption] No keys found for the user", userId);
      }

      return keys;
    } catch (error) {
      throw new Error("[encryption] Failed to get participant's keys");
    }
  }

  async createEncryptionSession(userId, olmMessageParams) {
    if (!this.#vodozemacInitialized || !this.#account) {
      throw new Error("[encryption] Service or account not initialized");
    }

    const userKeys = await this.#getUserKeys(userId);
    if (!userKeys) {
      delete this.#encryptionSessions[userId];
      throw new Error("[encryption] Could not retrieve opponent's keys");
    }

    const existSession = this.#encryptionSessions[userId];
    if (existSession) {
      console.log("Encrypted session from store:", existSession);
      return { session: existSession };
    }

    const olmMessage = olmMessageParams
      ? new OlmMessage(
          olmMessageParams.encrypted_message_type,
          olmMessageParams.body
        )
      : null;

    console.log("olmMessage:", olmMessage, userKeys.identity_key);
    console.log("one_time_pre_keys for session:", userKeys.one_time_pre_keys);
    try {
      const session = olmMessage
        ? this.#account.create_inbound_session(
            userKeys.identity_key,
            olmMessage
          )
        : this.#account.create_outbound_session(
            userKeys.identity_key,
            userKeys.one_time_pre_keys
          );
      console.log("session", session);

      this.#encryptionSessions[userId] = session;
      console.log("Encrypted session created:", session);
      return { session: this.#encryptionSessions[userId] };
    } catch (error) {
      console.log(error);

      throw new Error("[encryption] Failed to create encryption session");
    }
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

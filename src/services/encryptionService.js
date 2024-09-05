import api from "@api/api";
import createHash from "@utils/user/create_hash";
import initVodozemac, { Account } from "vodozemac-javascript";
import localforage from "localforage";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { upsertUser } from "@store/values/Participants";

class EncryptionService {
  #encryptionSession = null;
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
  }

  hasEncryptedAccount() {
    return !!this.#account;
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
        await localforage.removeItem("account");
        showCustomAlert("Account session has expired. Please log in again.");
        throw new Error("[encryption] Account session expired");
      }
    } else {
      this.#account = new Account();
      isNewAccount = true;
      const encryptedKey = this.#account.pickle(key);
      localforage.setItem("account", encryptedKey);
    }
    return { account: this.#account, isNewAccount };
  }

  async logout() {
    this.#account = null;
  }

  async registerDevice(lockPassword) {
    const { account, isNewAccount } = await this.#getAccount(lockPassword);

    if (!account) return;
    if (!isNewAccount) return { isSuccessAuth: true };

    account.generate_one_time_keys(50);
    console.log("Encryption: User account generated", account);

    const data = {
      identity_key: account.curve25519_key,
      signed_key: account.ed25519_key,
      one_time_pre_keys: Object.fromEntries(account.one_time_keys.entries()),
    };

    try {
      await api.encryptedDeviceCreate(data);
      return { isSuccessAuth: true };
    } catch (error) {
      console.error("[encryption] Failed to register device", error);
    }
  }

  async #getUserKeys(userId) {
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
      throw new Error("[encryption] Failed to get participant's keys");
    }
  }

  async createEncryptionSession(userId) {
    if (!this.#vodozemacInitialized || !this.#account) {
      throw new Error("[encryption] Service or account not initialized");
    }

    const userKeys = await this.#getUserKeys(userId);
    if (!userKeys) {
      throw new Error("[encryption] Could not retrieve opponent's keys");
    }

    try {
      const session = this.#account.create_outbound_session(
        userKeys.identity_key,
        userKeys.one_time_pre_keys
      );
      this.#encryptionSession = session;
      console.log("Encrypted session created:", session);
      return { session: this.#encryptionSession };
    } catch (error) {
      throw new Error("[encryption] Failed to create encryption session");
    }
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

import api from "@api/api";
import createHash from "@utils/user/create_hash";
import initVodozemac, { Account, OlmMessage } from "vodozemac-javascript";
import localforage from "localforage";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { upsertUser } from "@store/values/Participants";
import { Session } from "vodozemac-javascript";

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

  encryptMessage(text, userId) {
    const session = this.#encryptionSessions[userId];
    return session.encrypt(text);
  }

  decryptMessage(text, type = 0, userId) {
    const session = this.#encryptionSessions[userId];
    const olmMessage = new OlmMessage(type, text);

    if (!session) {
      throw new Error(
        "[encryption] Encrypted session with the opponent is missing"
      );
    }

    try {
      return session.decrypt(olmMessage);
    } catch (err) {
      throw new Error("[encryption] Failed to decrypt an encrypted message");
    }
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
        console.log("fromPickle: ", this.#account);
      } catch (error) {
        showCustomAlert("Incorrect key. Please try again.");
        throw new Error("[encryption] Incorrect key.");
      }
    } else {
      this.#account = new Account();
      this.#account.generate_one_time_keys(10);
      console.log("newAccount: ", this.#account);
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

    const data = {
      identity_key: account.curve25519_key,
      signed_key: account.ed25519_key,
      one_time_pre_keys: Object.fromEntries(account.one_time_keys.entries()),
    };

    try {
      await api.encryptedDeviceCreate(data);
      account.mark_keys_as_published();
      console.log("registerDevice: ", data);
      return { isSuccessAuth: true };
    } catch (error) {
      console.error("[encryption] Failed to register device", error);
      return { isSuccessAuth: false };
    }
  }

  async #getUserKeys(userId) {
    try {
      const usersKeys = await api.getEncryptedKeys({ user_ids: [userId] });
      console.log(userId, ": ", usersKeys);
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

    const existSessionPickle = await localforage.getItem(`session_${userId}`);
    if (existSessionPickle && !olmMessage) {
      try {
        const pickleSession = Session.from_pickle(
          existSessionPickle,
          `${api.curerntUserId}e14d23c4`
        );
        console.log("Encrypted session from pickle:", pickleSession);
        this.#encryptionSessions[userId] = pickleSession;
        return { session: pickleSession };
      } catch (error) {
        console.log("Failed create encryption session from pickle");
        localforage.removeItem(`session_${userId}`);
      }
    }

    const userKeys = await this.#getUserKeys(userId);
    if (!userKeys) {
      delete this.#encryptionSessions[userId];
      throw new Error("[encryption] Could not retrieve opponent's keys");
    }

    olmMessage &&
      console.log("Try to create session with olmMessage: ", olmMessage);
    !olmMessage &&
      console.log(
        "Create outbound session with keys: ",
        userKeys.identity_key,
        userKeys.one_time_pre_key
      );

    try {
      const session = olmMessage
        ? this.#account.create_inbound_session(
            userKeys.identity_key,
            olmMessage
          ).session
        : this.#account.create_outbound_session(
            userKeys.identity_key,
            userKeys.one_time_pre_key
          );
      this.#encryptionSessions[userId] = session;
      localforage.setItem(
        `session_${userId}`,
        session.pickle(`${api.curerntUserId}e14d23c4`)
      );
      console.log("Encrypted session created:", session);
      //if from olmeMessage, need to update last message from session object
      return { session: this.#encryptionSessions[userId] };
    } catch (error) {
      console.log(error);

      throw new Error("[encryption] Failed to create encryption session");
    }
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

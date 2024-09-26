import api from "@api/api";
import getBrowserFingerprint from "get-browser-fingerprint";
import initVodozemac, { Account, OlmMessage } from "vodozemac-javascript";
import localforage from "localforage";
import store from "@store/store";
import { Session } from "vodozemac-javascript";
import { decodeBase64, encodeUnpaddedBase64 } from "@utils/base64/base64";
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
  }

  hasAccount() {
    return !!this.#account;
  }

  async hasStoredAccount() {
    return !!(await localforage.getItem("account"));
  }

  async clearStoredAccount() {
    this.#account = null;
    await localforage.clear();
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

  #getPickleAdditionalData(userId, deviceId) {
    const additionalData = new Uint8Array(userId.length + deviceId.length + 1);
    for (let i = 0; i < userId.length; i++) {
      additionalData[i] = userId.charCodeAt(i);
    }
    additionalData[userId.length] = 124; // "|"
    for (let i = 0; i < deviceId.length; i++) {
      additionalData[userId.length + 1 + i] = deviceId.charCodeAt(i);
    }
    return additionalData;
  }

  async #encryptPickleKey(pickleKey, userId, deviceId) {
    if (!crypto?.subtle) {
      return undefined;
    }
    const cryptoKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    const iv = new Uint8Array(32);
    crypto.getRandomValues(iv);

    const additionalData = this.#getPickleAdditionalData(userId, deviceId);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData },
      cryptoKey,
      pickleKey
    );
    return { encrypted, iv, cryptoKey };
  }

  async #createPickleKey(userId, deviceId) {
    const randomArray = new Uint8Array(32);
    crypto.getRandomValues(randomArray);
    const data = await this.#encryptPickleKey(randomArray, userId, deviceId);
    if (data === undefined) {
      return null;
    }

    try {
      await localforage.setItem("pickleKey", data); // userId, deviceId ???
    } catch (e) {
      return null;
    }

    return encodeUnpaddedBase64(randomArray);
  }

  async #buildAndEncodePickleKey(data, userId, deviceId) {
    if (!crypto?.subtle) {
      return undefined;
    }
    if (!data || !data.encrypted || !data.iv || !data.cryptoKey) {
      return undefined;
    }

    try {
      const additionalData = this.#getPickleAdditionalData(userId, deviceId);
      const pickleKeyBuf = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: data.iv, additionalData },
        data.cryptoKey,
        data.encrypted
      );
      if (pickleKeyBuf) {
        return encodeUnpaddedBase64(pickleKeyBuf);
      }
    } catch (e) {
      console.log("[encryption] Error decrypting the pickle key", e);
    }

    return undefined;
  }

  async #getPickleKey(userId, deviceId) {
    let data;
    try {
      data = await localforage.getItem("pickleKey"); // userId, deviceId ???
    } catch (e) {
      console.log("[encryption] PickleKey could not be loaded", e);
    }

    return (
      (await this.#buildAndEncodePickleKey(data, userId, deviceId)) ?? null
    );
  }
  async #getAccount(userId, deviceId) {
    if (this.#account) {
      return this.#account;
    }

    const pickleKey = await this.#getPickleKey(userId, deviceId);
    const encAuthAccount = await localforage.getItem("account");

    let isNewAccount = false;
    if (encAuthAccount && pickleKey) {
      try {
        this.#account = Account.from_pickle(
          encAuthAccount,
          pickleKey.length === 43 ? decodeBase64(pickleKey) : pickleKey
        );
        console.log("fromPickle: ", this.#account);
      } catch (error) {
        throw new Error("[encryption] Incorrect key.");
      }
    } else {
      this.#account = new Account();
      this.#account.generate_one_time_keys(10);
      console.log("newAccount: ", this.#account);
      isNewAccount = true;

      const createdPickleKey = await this.#createPickleKey(userId, deviceId);
      const encryptedAccount = this.#account.pickle(
        createdPickleKey.length === 43
          ? decodeBase64(createdPickleKey)
          : createdPickleKey
      );

      localforage.setItem("account", encryptedAccount);
    }
    return { account: this.#account, isNewAccount };
  }

  async registerDevice(userId) {
    try {
      const stringDeviceId = getBrowserFingerprint({
        enableScreen: false,
        hardwareOnly: true,
      }).toString();

      const { account, isNewAccount } = await this.#getAccount(
        userId,
        stringDeviceId
      );

      if (!account) return;
      if (!isNewAccount) return { isSuccessAuth: true };

      const data = {
        identity_key: account.curve25519_key,
        signed_key: account.ed25519_key,
        one_time_pre_keys: Object.fromEntries(account.one_time_keys.entries()),
      };

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

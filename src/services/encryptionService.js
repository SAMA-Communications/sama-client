import CryptoJS from "crypto-js";
import api from "@api/api";
import initVodozemac, {
  Account,
  OlmMessage,
  Session,
} from "vodozemac-javascript";
import localforage from "localforage";
import store from "@store/store";
import { decodeBase64, encodeUnpaddedBase64 } from "@utils/base64/base64";
import { upsertMessage } from "@store/values/Messages";
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
    this.#encryptionSessions = {};
    await localforage.clear();
  }

  encryptMessage(text, userId) {
    const session = this.#encryptionSessions[userId];
    return session.encrypt(text);
  }

  decryptMessage(olmMessageParams, userId) {
    let session = this.#encryptionSessions[userId];

    const olmMessage = new OlmMessage(
      olmMessageParams.encrypted_message_type,
      olmMessageParams.body
    );

    if (!session) {
      console.log(
        "[encryption] Encrypted session with the opponent is missing"
      );
      return "Can`t decrypt this message, not for this device";
    }

    try {
      return session.decrypt(olmMessage);
    } catch (error) {
      console.log("[encryption] Failed to decrypt an encrypted message", error);
      return "Can`t decrypt this message, not for this device";
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

  async #createPickleKey(dbName, userId, deviceId) {
    const randomArray = new Uint8Array(32);
    crypto.getRandomValues(randomArray);
    const data = await this.#encryptPickleKey(randomArray, userId, deviceId);
    if (data === undefined) {
      return null;
    }

    try {
      await localforage.setItem(dbName, data); // userId, deviceId ???
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

  async #getPickleKey(dbName, userId, deviceId) {
    let data;
    try {
      data = await localforage.getItem(dbName); // userId, deviceId ???
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

    const pickleKey = await this.#getPickleKey("pickleKey", userId, deviceId);
    const encAuthAccount = await localforage.getItem("account");

    let isNewAccount = false;
    if (encAuthAccount && pickleKey) {
      try {
        this.#account = Account.from_pickle(
          encAuthAccount,
          decodeBase64(pickleKey)
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

      const createdPickleKey = await this.#createPickleKey(
        "pickleKey",
        userId,
        deviceId
      );
      const encryptedAccount = this.#account.pickle(
        decodeBase64(createdPickleKey)
      );

      localforage.setItem("account", encryptedAccount);
    }
    return { account: this.#account, isNewAccount };
  }

  async registerDevice(userId) {
    try {
      const { account, isNewAccount } = await this.#getAccount(
        userId,
        api.currentDeviceId
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

  async #storeSessionLocally(opponentId, session) {
    this.#encryptionSessions[opponentId] = session;
    const sessionPickleKey = await this.#createPickleKey(
      "sessionPickleKey",
      opponentId,
      api.currentDeviceId
    );
    localforage.setItem(
      `encryptedSession${opponentId}`,
      session.pickle(decodeBase64(sessionPickleKey))
    );
  }

  async createEncryptionSession(userId, olmMessageParams) {
    if (!this.#vodozemacInitialized || !this.#account) {
      throw new Error("[encryption] Service or account not initialized");
    }

    const olmMessage = olmMessageParams
      ? new OlmMessage(
          olmMessageParams.encrypted_message_type,
          olmMessageParams.body
        )
      : null;

    let session = this.#encryptionSessions[userId];
    if (session) {
      if (olmMessage && session.session_matches(olmMessage)) {
        console.log("Encrypted session from local store:", session);
        const decryptMessage = this.decryptMessage(olmMessageParams, userId);

        store.dispatch(
          upsertMessage({ _id: olmMessageParams._id, body: decryptMessage })
        );
        return { session };
      } else if (!olmMessage) {
        console.log("Encrypted session from local store:", session);
        return { session };
      }
    }

    const sessionFromPickle = await localforage.getItem(
      `encryptedSession${userId}`
    );
    if (sessionFromPickle && !olmMessage) {
      try {
        const sessionPickleKey = await this.#getPickleKey(
          "sessionPickleKey",
          userId,
          api.currentDeviceId
        );
        session = Session.from_pickle(
          sessionFromPickle,
          decodeBase64(sessionPickleKey)
        );

        this.#encryptionSessions[userId] = session;
        console.log("Encrypted session from pickle:", session);

        return { session };
      } catch (error) {
        console.log("Failed create encryption session from pickle");
        localforage.removeItem(`encryptedSession${userId}`);
      }
    }

    const userKeys = await this.#getUserKeys(userId);
    if (!userKeys) {
      delete this.#encryptionSessions[userId];
      throw new Error("[encryption] Could not retrieve opponent's keys");
    }

    try {
      if (olmMessage) {
        console.log("Create session with olmMessage: ", olmMessage);

        try {
          const inboundSession = this.#account.create_inbound_session(
            userKeys.identity_key,
            olmMessage
          );
          const decryptMessage = `${inboundSession.plaintext}`;
          session = inboundSession.session;

          store.dispatch(
            upsertMessage({ _id: olmMessageParams._id, body: decryptMessage })
          );
        } catch (error) {
          console.error("Failed to create inbound session:", error);
        }

        //check if the top block worked successfully -> mb need to clear the session param
        if (session) {
          await this.#storeSessionLocally(userId, session);
          console.log("Encrypted session created:", session);
          return { session };
        }
      }
      console.log(
        "Create outbound session with keys: ",
        userKeys.identity_key,
        userKeys.one_time_pre_key
      );

      session = this.#account.create_outbound_session(
        userKeys.identity_key,
        userKeys.one_time_pre_key
      );

      await this.#storeSessionLocally(userId, session);
      console.log("Encrypted session created:", session);
      return { session };
    } catch (error) {
      console.log(error);
      throw new Error("[encryption] Failed to create encryption session");
    }
  }

  async encrypteDataForLocalStore(data) {
    const secretKey = await this.#getPickleKey(
      "pickleKey",
      api.curerntUserId,
      api.currentDeviceId
    );

    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey
    ).toString();

    return ciphertext;
  }

  async decryptDataFromLocalStore(ciphertext) {
    const secretKey = await this.#getPickleKey(
      "pickleKey",
      api.curerntUserId,
      api.currentDeviceId
    );

    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
  }
}

const encryptionService = new EncryptionService();

export default encryptionService;

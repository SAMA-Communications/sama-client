import api from "@api/api";
import initVodozemac, { Account } from "vodozemac-javascript";
import { setEncryptedUser } from "@src/store/values/EncryptedUser";

class EncryptionService {
  constructor() {
    this.vodozemac = initVodozemac();
    this.account = null;
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
}

const encryptionService = new EncryptionService();

export default encryptionService;

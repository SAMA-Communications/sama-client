import api from "@api/api";
import encryptionService from "./encryptionService";
import indexedDB from "@store/indexedDB";
import localforage from "localforage";
import store from "@store/store";
import { clearMessageIdsToLocalLimit } from "@store/values/Conversations";
import { clearMessagesToLocalLimit } from "@store/values/Messages";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

class GarbageCleaningService {
  async #clearAccountData() {
    await encryptionService.clearStoredAccount();
  }

  #clearAccountDataSync() {
    encryptionService.clearStoredAccount();
  }

  #clearLocalMessageIds(cid) {
    store.dispatch(clearMessageIdsToLocalLimit(cid));
  }

  #clearLocalMessages(cid) {
    store.dispatch(clearMessagesToLocalLimit(cid));
  }

  async clearConversationMessages(cid) {
    if (!cid) return;
    this.#clearLocalMessageIds(cid);
    this.#clearLocalMessages(cid);
  }

  async resetDataOnAuth() {
    await this.#clearAccountData();
    await this.clearAllLocalData();
    store.dispatch(setSelectedConversation({}));
    store.dispatch(setUserIsLoggedIn(true));
  }

  async handleLogout() {
    await api.userLogout();
    await this.#clearAccountData();
    await this.clearAllLocalData();
    store.dispatch({ type: "RESET_STORE" });
    store.dispatch(updateNetworkState(true));
  }

  handleLoginFailure() {
    this.#clearAccountDataSync();
    this.clearAllLocalData();
    localStorage.removeItem("sessionId");
  }

  async clearAllLocalData() {
    await Promise.all([localforage.clear(), indexedDB.removeAllMessages()]);
  }
}

const garbageCleaningService = new GarbageCleaningService();

export default garbageCleaningService;

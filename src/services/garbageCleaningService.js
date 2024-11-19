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
  async clearConversationMessages(cid) {
    if (!cid) return;
    store.dispatch(clearMessagesToLocalLimit(cid));
    store.dispatch(clearMessageIdsToLocalLimit(cid));
  }

  async resetDataOnAuth() {
    await this.clearStorage();
    store.dispatch(setSelectedConversation({}));
    store.dispatch(setUserIsLoggedIn(true));
  }

  async handleLogout() {
    await api.userLogout();
    await this.clearStorage();
    store.dispatch({ type: "RESET_STORE" });
    store.dispatch(updateNetworkState(true));
  }

  handleLoginFailure() {
    this.clearStorage();
    localStorage.removeItem("sessionId");
  }

  async clearStorage() {
    await Promise.all([localforage.clear(), indexedDB.removeAllMessages()]);
    await encryptionService.clearStoredAccount();
  }
}

const garbageCleaningService = new GarbageCleaningService();

export default garbageCleaningService;

import showCustomAlert from "@utils/show_alert.js";
import store from "@store/store.js";
import { loadQuickJs } from "https://esm.sh/@sebastianwessel/quickjs@latest";
import { updateScheme, upsertChat } from "@store/values/Conversations.js";

import api from "@api/api.js";

class ConversationSchemeService {
  #options = { allowFetch: true, allowFs: true };
  #sandBox = null;

  constructor() {
    this.initializeSandbox();
  }

  async initializeSandbox() {
    try {
      this.#sandBox = await loadQuickJs(
        "https://esm.sh/@jitl/quickjs-ng-wasmfile-release-sync"
      );
    } catch (error) {
      console.error("Failed to initialize sandbox:", error);
    }
  }

  async runScheme(code, message, user) {
    if (!this.#sandBox) throw new Error("Sandbox is not initialized");
    return await this.#sandBox.runSandboxed(
      async ({ evalCode }) => evalCode(code),
      {
        ...this.#options,
        env: {
          MESSAGE: message,
          USER: user,
          RESOLVE: (value) => value,
          REJECT: (value) => value,
        },
      }
    );
  }

  async validateScheme(code) {
    if (!this.#sandBox) throw new Error("Sandbox is not initialized");

    const { ok } = await this.#sandBox.runSandboxed(async ({ validateCode }) =>
      validateCode(code)
    );

    return {
      noSyntaxError: ok,
      noConsoleLog: !/console\.log/.test(code),
      existResolve: /return\s+resolve/.test(code),
    };
  }

  async saveSchemeByConversation(cid, scheme) {
    try {
      await api.conversationSchemeCreate({ cid, scheme });
      const currentUserId = store.getState().currentUserId.value.id;
      store.dispatch(
        updateScheme({
          _id: cid,
          scheme,
          updated_by: currentUserId,
          updated_at: Date.now(),
          not_saved: undefined,
        })
      );
      localStorage.removeItem(`conversation_scheme_${cid}`);
      showCustomAlert("The scheme was successfully saved.", "success");
    } catch (error) {
      console.error("Failed to save scheme:", error);
      showCustomAlert("Failed to save the scheme. Please try again.", "error");
    }
  }

  async getSchemeFromLocalStorage(cid) {
    const localStoredScheme = localStorage.getItem(
      `conversation_scheme_${cid}`
    );
    if (localStoredScheme)
      store.dispatch(updateScheme({ _id: cid, not_saved: true }));
    return localStoredScheme;
  }

  async syncConversationScheme(cid) {
    // const localStoredScheme = await this.getSchemeFromLocalStorage(cid);
    // if (localStoredScheme) return;

    const reduxStoredScheme =
      store.getState().conversations.entities[cid]?.scheme_options;
    if (reduxStoredScheme?.scheme) {
      store.dispatch(updateScheme({ _id: cid, ...reduxStoredScheme }));
      return;
    }

    try {
      const schemeOptions = await api.getConversationScheme({ cid });
      store.dispatch(updateScheme({ _id: cid, ...schemeOptions }));
    } catch (error) {
      console.warn("Failed to fetch scheme from API:", error);
      store.dispatch(upsertChat({ _id: cid, scheme_options: null }));
    }
  }

  async deleteConversationScheme(cid) {
    try {
      await api.conversationSchemeDelete({ cid });
    } catch (error) {
      console.warn("Failed to delete scheme:", error);
    } finally {
      localStorage.removeItem(`conversation_scheme_${cid}`);
      store.dispatch(upsertChat({ _id: cid, scheme_options: null }));
    }
  }
}

const conversationSchemeService = new ConversationSchemeService();

export default conversationSchemeService;

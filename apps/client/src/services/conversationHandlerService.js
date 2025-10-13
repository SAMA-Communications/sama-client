import variant from "https://esm.sh/@jitl/quickjs-ng-wasmfile-release-sync";
import { loadQuickJs } from "https://esm.sh/@sebastianwessel/quickjs@3.0.0?deps=memfs@4.0.0";

import api from "@api/api.js";

import store from "@store/store.js";
import { updateHandler, upsertChat } from "@store/values/Conversations.js";

import { showCustomAlert } from "@utils/GeneralUtils.js";
import { EDITOR_FETCH_ERROR_MESSAGE } from "@utils/constants.js";

class ConversationHandlerService {
  #options = { allowFetch: true, allowFs: false, executionTimeout: 3000 };
  #sandBox = null;

  constructor() {
    this.initializeSandbox();
  }

  async initializeSandbox() {
    try {
      this.#sandBox = await loadQuickJs(variant);
    } catch (error) {
      console.error("Failed to initialize sandbox:", error);
    }
  }

  async runHandler(code, message, user) {
    if (!this.#sandBox) throw new Error("Sandbox is not initialized");
    let errorMessage = null;

    const env = {
      MESSAGE: message,
      USER: user,
      ACCEPT: () => {},
      RESOLVE: (value) => value,
      REJECT: (value) => (errorMessage = value),
      FETCH: async (input, init = {}) => {
        try {
          const res = await fetch(input, init);
          const data = await res.json();
          return {
            ok: res.ok,
            status: res.status,
            headers: res.headers,
            json: async () => data,
            text: async () => JSON.stringify(data),
          };
        } catch (e) {
          errorMessage = EDITOR_FETCH_ERROR_MESSAGE;
          return {
            ok: false,
            status: 500,
            json: async () => ({}),
            text: async () => "",
          };
        }
      },
    };

    const result = await this.#sandBox.runSandboxed(
      async ({ evalCode }) => evalCode(code),
      { ...this.#options, env }
    );

    return errorMessage ? { ...result, error: errorMessage } : result;
  }

  getHandlerModelByCid(monaco, id) {
    const uri = monaco?.Uri.parse(`file://${id}`);
    const model = monaco?.editor.getModel(uri);
    return model;
  }

  async validateHandler(code, originCode) {
    if (!this.#sandBox) throw new Error("Sandbox is not initialized");

    const { ok } = await this.#sandBox.runSandboxed(async ({ validateCode }) =>
      validateCode(code)
    );

    return {
      noSyntaxError: ok,
      isExportHandler: /export\s+default\s+await\s+handler\s*\(.*\)/.test(
        originCode
      ),
      isHandlerHeader:
        /const\s+handler\s*=\s*async\s*\(message,\s*user,\s*accept,\s*resolve,\s*reject,\s*fetch\)\s*=>\s*\{/.test(
          originCode
        ),
    };
  }

  async saveHandlerByConversation(cid, content) {
    try {
      await api.conversationHandlerCreate({ cid, content });
      const currentUserId = store.getState().currentUserId.value.id;
      store.dispatch(
        updateHandler({
          _id: cid,
          content,
          updated_by: currentUserId,
          updated_at: Date.now(),
          not_saved: undefined,
        })
      );
      localStorage.removeItem(`conversation_handler_${cid}`);
      showCustomAlert("The handler was successfully saved.", "success");
    } catch (error) {
      console.error("Failed to save handler:", error);
      showCustomAlert("Failed to save the handler. Please try again.", "error");
    }
  }

  async getHandlerFromLocalStorage(cid) {
    const localStoredHandlerContent = localStorage.getItem(
      `conversation_handler_${cid}`
    );
    if (localStoredHandlerContent)
      store.dispatch(updateHandler({ _id: cid, not_saved: true }));
    return localStoredHandlerContent;
  }

  async syncConversationHandler(cid) {
    // const localStoredHandlerContent = await this.getHandlerFromLocalStorage(cid);
    // if (localStoredHandlerContent) return;

    const reduxStoredScheme =
      store.getState().conversations.entities[cid]?.handler_options;
    if (reduxStoredScheme?.scheme) {
      store.dispatch(updateHandler({ _id: cid, ...reduxStoredScheme }));
      return;
    }

    try {
      const schemeOptions = await api.getConversationHandler({ cid });
      store.dispatch(updateHandler({ _id: cid, ...schemeOptions }));
    } catch (error) {
      console.warn("Failed to fetch scheme from API:", error);
      store.dispatch(upsertChat({ _id: cid, handler_options: null }));
    }
  }

  async deleteConversationHandler(cid) {
    try {
      await api.conversationHandlerDelete({ cid });
    } catch (error) {
      console.warn("Failed to delete scheme:", error);
    } finally {
      localStorage.removeItem(`conversation_handler_${cid}`);
      store.dispatch(upsertChat({ _id: cid, handler_options: null }));
    }
  }
}

const conversationHandlerService = new ConversationHandlerService();

export default conversationHandlerService;

import variant from "@jitl/quickjs-singlefile-browser-release-sync";
import { loadQuickJs } from "@sebastianwessel/quickjs";
import api from "@api/api.js";
import store from "@store/store.js";
import { updateHandler, upsertChat } from "@store/values/Conversations.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { EDITOR_FETCH_ERROR_MESSAGE } from "@utils/constants.js";

const SANDBOX_OPTIONS = { allowFetch: true, allowFs: false, executionTimeout: 3000 };

const REGEX = {
  exportHandler: /export\s+default\s+await\s+handler\s*\(.*\)/,
  handlerHeader: /const\s+handler\s*=\s*async\s*\(message,\s*user,\s*accept,\s*resolve,\s*reject,\s*fetch\)\s*=>\s*\{/,
};

class ConversationHandlerService {
  #sandBox = null;
  #initPromise = null;

  async #initSandbox() {
    try {
      this.#sandBox = await loadQuickJs(variant);
      return this.#sandBox;
    } catch (error) {
      console.error("Failed to initialize sandbox:", error);
      return null;
    }
  }

  async #ensureReady() {
    if (!this.#initPromise) this.#initPromise = this.#initSandbox();
    await this.#initPromise;
  }

  async runHandler(code, message, user) {
    await this.#ensureReady();
    if (!this.#sandBox) {
      return { ok: false, data: null, error: "Sandbox is not available" };
    }

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
        } catch {
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

    const result = await this.#sandBox.runSandboxed(async ({ evalCode }) => evalCode(code), {
      ...SANDBOX_OPTIONS,
      env,
    });

    return errorMessage ? { ...result, error: errorMessage } : result;
  }

  getHandlerModelByCid(monaco, id) {
    const uri = monaco?.Uri.parse(`file://${id}`);
    return monaco?.editor.getModel(uri);
  }

  async validateHandler(code, originCode) {
    const fallbackResult = {
      noSyntaxError: false,
      isExportHandler: REGEX.exportHandler.test(originCode ?? ""),
      isHandlerHeader: REGEX.handlerHeader.test(originCode ?? ""),
    };

    await this.#ensureReady();
    if (!this.#sandBox) return fallbackResult;

    try {
      const { ok } = await this.#sandBox.runSandboxed(async ({ evalCode }) => evalCode(code));
      return {
        noSyntaxError: ok,
        isExportHandler: REGEX.exportHandler.test(originCode ?? ""),
        isHandlerHeader: REGEX.handlerHeader.test(originCode ?? ""),
      };
    } catch {
      return fallbackResult;
    }
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
        }),
      );
      localStorage.removeItem(`conversation_handler_${cid}`);
      showCustomAlert("The handler was successfully saved.", "success");
    } catch (error) {
      console.error("Failed to save handler:", error);
      showCustomAlert("Failed to save the handler. Please try again.", "error");
    }
  }

  getHandlerFromLocalStorage(cid) {
    const content = localStorage.getItem(`conversation_handler_${cid}`);
    if (content) store.dispatch(updateHandler({ _id: cid, not_saved: true }));
    return content;
  }

  async syncConversationHandler(cid) {
    const stored = store.getState().conversations.entities[cid]?.handler_options;
    if (stored?.scheme) {
      store.dispatch(updateHandler({ _id: cid, ...stored }));
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

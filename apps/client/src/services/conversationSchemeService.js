import { loadQuickJs } from "https://esm.sh/@sebastianwessel/quickjs@latest";

import api from "@api/api.js";

class ConversationSchemeService {
  #options;
  #sandBox;

  constructor() {
    this.#options = { allowFetch: false, allowFs: false };
    loadQuickJs("https://esm.sh/@jitl/quickjs-ng-wasmfile-release-sync").then(
      (sandBox) => (this.#sandBox = sandBox)
    );
  }

  async runScheme(code, message, user) {
    const compilationResult = await this.#sandBox.runSandboxed(
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
    return compilationResult;
  }

  async saveSchemeByConversation(cid, scheme) {
    await api.conversationSchemeCreate({ cid, scheme });
  }

  async getConversationScheme(cid) {
    return await api.getConversationScheme({ cid });
  }

  async deleteConversationScheme(cid) {
    await api.conversationSchemeDelete({ cid });
  }
}

const conversationSchemeService = new ConversationSchemeService();

export default conversationSchemeService;

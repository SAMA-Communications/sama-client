import api from "@api/api.js";

import store from "@store/store.js";
import { upsertChat } from "@store/values/Conversations.js";

import showCustomAlert from "@utils/show_alert.js";

class AIService {
  async summarizeMessages({ cid, filter }) {
    store.dispatch(
      upsertChat({ _id: cid, summary: { isLoading: true, filter } })
    );

    try {
      const summMessage = await api.messageSummary({ cid, filter });
      console.log(summMessage);

      store.dispatch(
        upsertChat({
          _id: cid,
          summary: { isLoading: false, text: summMessage, filter },
        })
      );
    } catch (err) {
      console.error(err);
      store.dispatch(
        upsertChat({
          _id: cid,
          summary: {
            isLoading: false,
            text: "AI assistant error. Failed to create message.",
            filter,
          },
        })
      );
    }
  }

  async changeMessageTone({ body, tone }) {
    try {
      const modifiedMessage = await api.messageTone({ body, tone });
      return modifiedMessage;
    } catch (err) {
      console.error(err);
      showCustomAlert(
        "AI assistant error. Failed to create message.",
        "danger"
      );
    }
  }
}

const aiService = new AIService();

export default aiService;

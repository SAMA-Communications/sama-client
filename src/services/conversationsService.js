import api from "../api/api";
import eventEmitter from "../event/eventEmitter";
import showCustomAlert from "../utils/show_alert";
import store from "../store/store";
import { addUsers, upsertUsers } from "../store/Participants";
import { history } from "../_helpers/history";
import {
  insertChats,
  removeChat,
  upsertChat,
  upsertParticipants,
} from "../store/Conversations";
import { notificationQueueByCid } from "./notifications";
import { setSelectedConversation } from "../store/SelectedConversation";

class ConversationsService {
  userIsLoggedIn = false;

  constructor() {
    api.onConversationCreateListener = (chat) => {
      api.getParticipantsByCids({ cids: [chat._id] }).then((users) => {
        store.dispatch(
          upsertChat({
            ...chat,
            unread_messages_count: chat.unread_messages_count || 0,
            messagesIds: [],
            participants: users.map((u) => u._id),
          })
        );
        store.dispatch(addUsers(users));

        notificationQueueByCid[chat._id]?.map((pushMessage) =>
          eventEmitter.emit("onMessage", pushMessage)
        );
      });
    };

    api.onConversationDeleteListener = (chat) => {
      store.dispatch(removeChat(chat._id));
      if (history.location.hash.includes(chat._id.toString())) {
        store.dispatch(setSelectedConversation({}));
        showCustomAlert(
          `You were removed from the ${chat.name} conversation`,
          "warning"
        );
        history.navigate("/main");
      }
    };

    store.subscribe(() => {
      let previousValue = this.userIsLoggedIn;
      this.userIsLoggedIn = store.getState().userIsLoggedIn.value;

      if (this.userIsLoggedIn && !previousValue) {
        this.syncData();
      }
    });
  }

  async syncData() {
    api.conversationList({}).then((chats) => {
      store.dispatch(insertChats(chats));
      chats.length &&
        api
          .getParticipantsByCids({ cids: chats.map((el) => el._id) })
          .then((users) => store.dispatch(upsertUsers(users)));
    });
  }
}

const conversationService = new ConversationsService();

export default conversationService;

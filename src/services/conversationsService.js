import api from "../api/api";
import store from "../store/store";
import { insertChats, removeChat, upsertChat } from "../store/Conversations";
import { addUsers, upsertUsers } from "../store/Participants";
import { history } from "../_helpers/history";
import { setSelectedConversation } from "../store/SelectedConversation";

class ConversationsService {
  userIsLoggedIn = false;

  constructor() {
    api.onConversationCreateListener = (chat) => {
      store.dispatch(
        upsertChat({
          ...chat,
          unread_messages_count: chat.unread_messages_count || 0,
          messagesIds: [],
        })
      );
      api
        .getParticipantsByCids({ cids: [chat._id] })
        .then((users) => store.dispatch(addUsers(users)));
    };

    api.onConversationDeleteListener = (chat) => {
      store.dispatch(removeChat(chat._id));
      if (history.location.hash.includes(chat._id.toString())) {
        store.dispatch(setSelectedConversation({}));
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

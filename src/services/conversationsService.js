import api from "@api/api";
import eventEmitter from "@event/eventEmitter";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { addUsers, upsertUsers } from "@store/values/Participants";
import { history } from "@helpers/history";
import {
  insertChat,
  insertChats,
  removeChat,
  upsertChat,
} from "@store/values/Conversations";
import { notificationQueueByCid } from "@services/notifications";
import { setSelectedConversation } from "@store/values/SelectedConversation";

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
        history.navigate("/");
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
      store.dispatch(
        insertChats(chats.map((obj) => ({ ...obj, participants: [] })))
      );
      chats.length &&
        api
          .getParticipantsByCids({ cids: chats.map((el) => el._id) })
          .then((users) => store.dispatch(upsertUsers(users)));
    });
  }

  async createPrivateChat(userId, userObject) {
    if (!userId) {
      return;
    }

    const requestData = {
      type: "u",
      participants: [userId],
    };

    const chat = await api.conversationCreate(requestData);
    userObject && store.dispatch(addUsers([userObject]));
    store.dispatch(insertChat({ ...chat, messagesIds: [] }));

    history.navigate(`/#${chat._id}`);
    store.dispatch(setSelectedConversation({ id: chat._id }));
  }
}

const conversationService = new ConversationsService();

export default conversationService;

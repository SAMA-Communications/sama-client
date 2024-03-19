import api from "@api/api";
import eventEmitter from "@event/eventEmitter";
import navigateTo from "@utils/navigation/navigate_to";
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
            messagesIds: null,
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
    store.dispatch(insertChat({ ...chat, messagesIds: null }));

    navigateTo(`/#${chat._id}`);
    store.dispatch(setSelectedConversation({ id: chat._id }));
  }

  async createGroupChat(participants, name) {
    if (!participants.length || !name) {
      showCustomAlert("Choose participants.", "warning");
      return;
    }

    const chat = await api.conversationCreate({
      type: "g",
      name,
      participants: participants.map((el) => el._id),
    });

    store.dispatch(addUsers(participants));
    store.dispatch(insertChat({ ...chat, messagesIds: null }));

    navigateTo(`/#${chat._id}`);
    store.dispatch(setSelectedConversation({ id: chat._id }));
  }

  #validateFieldLength(field) {
    return field.length < 256 && field.length > 0;
  }

  async sendEditNameAndDescriptionRequest(data) {
    const keys = Object.keys(data);
    if (!keys.length) {
      return;
    }

    for (const key of keys) {
      if (!this.#validateFieldLength(data[key])) {
        showCustomAlert(
          `The length of the ${key} field must be from 0 to 255 characters.`,
          "warning"
        );
        return false;
      }
    }

    const selectedConversation = store.getState().selectedConversation.value;

    return await api.conversationUpdate({
      cid: selectedConversation.id,
      ...data,
    });
  }

  async sendAddParticipantsRequest(participants) {
    const selectedConversation = store.getState().selectedConversation.value;

    if (!participants.length) {
      return;
    }

    const addUsersArr = participants.map((el) => el._id);
    const requestData = {
      cid: selectedConversation.id,
      participants: { add: addUsersArr },
    };

    if (
      !window.confirm(
        `Add selected user${participants.length > 1 ? "s" : ""} to the chat?`
      )
    ) {
      return;
    }

    return await api.conversationUpdate(requestData);
  }
}

const conversationService = new ConversationsService();

export default conversationService;

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
  upsertParticipants,
} from "@store/values/Conversations";
import { notificationQueueByCid } from "@services/notifications";
import {
  clearSelectedConversation,
  setSelectedConversation,
} from "@store/values/SelectedConversation";

class ConversationsService {
  userIsLoggedIn = false;

  constructor() {
    api.onConversationCreateListener = this.handleConversationCreate;
    api.onConversationDeleteListener = this.handleConversationDelete;

    store.subscribe(this.handleStoreUpdate);
  }

  handleStoreUpdate = () => {
    const currentUserIsLoggedIn = store.getState().userIsLoggedIn.value;
    if (currentUserIsLoggedIn && !this.userIsLoggedIn) {
      this.userIsLoggedIn = true;
      this.syncData();
    } else if (!currentUserIsLoggedIn && this.userIsLoggedIn) {
      this.userIsLoggedIn = false;
    }
  };

  handleConversationCreate = async (chat) => {
    try {
      const users = await api.getParticipantsByCids({ cids: [chat._id] });
      store.dispatch(
        upsertChat({
          ...chat,
          unread_messages_count: chat.unread_messages_count || 0,
          messagesIds: null,
          participants: users.map((u) => u._id),
        })
      );
      store.dispatch(addUsers(users));

      notificationQueueByCid[chat._id]?.forEach((pushMessage) =>
        eventEmitter.emit("onMessage", pushMessage)
      );
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  handleConversationDelete = (chat) => {
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

  async syncData() {
    try {
      const chats = await api.conversationList({});
      store.dispatch(
        insertChats(chats.map((obj) => ({ ...obj, participants: [] })))
      );
      if (chats.length > 0) {
        const users = await api.getParticipantsByCids({
          cids: chats.map((el) => el._id),
        });
        store.dispatch(upsertUsers(users));
      }
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
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

    try {
      return await api.conversationUpdate({
        cid: selectedConversation.id,
        ...data,
      });
    } catch (error) {
      showCustomAlert(error.message, "danger");
      return false;
    }
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

  async sendRemoveParticipantRequest(userId) {
    if (!window.confirm(`Do you want to delete this user?`)) {
      return;
    }
    const { selectedConversation, conversations } = store.getState();
    const selectedCID = selectedConversation.value.id;

    await api.conversationUpdate({
      cid: selectedCID,
      participants: { remove: [userId] },
    });

    store.dispatch(
      upsertParticipants({
        cid: selectedCID,
        participants: conversations.entities[selectedCID].participants.filter(
          (uId) => uId !== userId
        ),
      })
    );
  }

  async sendDeleteRequest() {
    try {
      const isConfirm = window.confirm(`Do you want to delete this chat?`);
      if (isConfirm) {
        const selectedConversation =
          store.getState().selectedConversation.value;

        await api.conversationDelete({ cid: selectedConversation.id });
        store.dispatch(clearSelectedConversation());
        store.dispatch(removeChat(selectedConversation.id));
        navigateTo("/");
      }
    } catch (error) {
      showCustomAlert(error.message, "warning");
    }
  }
}

const conversationService = new ConversationsService();

export default conversationService;

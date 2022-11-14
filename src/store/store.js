import conversationsReducer from "./Conversations";
// import unreadMessagesReducer from "./UnreadMessages";
import selectedConversationReducer from "./SelectedConversation";
import participantsReducer from "./Participants";
import messageReducer from "./Messages";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    conversations: conversationsReducer,
    // unreadMessages: unreadMessagesReducer,
    selectedConversation: selectedConversationReducer,
    participants: participantsReducer,
    messages: messageReducer,
  },
});

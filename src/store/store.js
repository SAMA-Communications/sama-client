import conversationsReducer from "./Conversations";
import selectedConversationReducer from "./SelectedConversation";
import participantsReducer from "./Participants";
import messageReducer from "./Messages";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    conversations: conversationsReducer,
    selectedConversation: selectedConversationReducer,
    participants: participantsReducer,
    messages: messageReducer,
  },
});

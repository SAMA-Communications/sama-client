import connectStateReducer from "./ConnectState";
import conversationsReducer from "./Conversations";
import messageReducer from "./Messages";
import participantsReducer from "./Participants";
import selectedConversationReducer from "./SelectedConversation";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    connectState: connectStateReducer,
    conversations: conversationsReducer,
    messages: messageReducer,
    participants: participantsReducer,
    selectedConversation: selectedConversationReducer,
  },
});

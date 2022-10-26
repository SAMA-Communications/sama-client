import conversationsReducer from "./Conversations";
import conversationReducer from "./CurrentConversation";
import participantsReducer from "./Participants";
import messageReducer from "./Messages";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    conversations: conversationsReducer,
    conversation: conversationReducer,
    participants: participantsReducer,
    messages: messageReducer,
  },
});

import conversationReducer from "./Conversations";
import messageReducer from "./Messages";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    conversations: conversationReducer,
    messages: messageReducer,
  },
});

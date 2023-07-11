import conversationsReducer from "./Conversations";
import messageReducer from "./Messages";
import networkStateReducer from "./NetworkState";
import participantsReducer from "./Participants";
import selectedConversationReducer from "./SelectedConversation";
import userIsLoggedInReducer from "./UserIsLoggedIn ";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    conversations: conversationsReducer,
    messages: messageReducer,
    networkState: networkStateReducer,
    participants: participantsReducer,
    selectedConversation: selectedConversationReducer,
    userIsLoggedIn: userIsLoggedInReducer,
  },
});

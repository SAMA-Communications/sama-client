import conversationsReducer from "./Conversations";
import messageReducer from "./Messages";
import networkStateReducer from "./NetworkState";
import participantsReducer from "./Participants";
import selectedConversationReducer from "./SelectedConversation";
import userIsLoggedInReducer from "./UserIsLoggedIn ";
import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  conversations: conversationsReducer,
  messages: messageReducer,
  networkState: networkStateReducer,
  participants: participantsReducer,
  selectedConversation: selectedConversationReducer,
  userIsLoggedIn: userIsLoggedInReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

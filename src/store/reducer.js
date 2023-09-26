import conversationsReducer from "./Conversations";
import isMobileViewReducer from "./IsMobileView";
import messageReducer from "./Messages";
import networkStateReducer from "./NetworkState";
import participantsReducer from "./Participants";
import selectedConversationReducer from "./SelectedConversation";
import userIsLoggedInReducer from "./UserIsLoggedIn ";
import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  conversations: conversationsReducer,
  isMobileView: isMobileViewReducer,
  messages: messageReducer,
  networkState: networkStateReducer,
  participants: participantsReducer,
  selectedConversation: selectedConversationReducer,
  userIsLoggedIn: userIsLoggedInReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    const { isMobileView, networkState, userIsLoggedIn } = state;
    state = { isMobileView, networkState, userIsLoggedIn };
  }

  return appReducer(state, action);
};

export default rootReducer;

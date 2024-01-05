import conversationsReducer from "@store/Conversations";
import isMobileViewReducer from "@store/IsMobileView";
import messageReducer from "@store/Messages";
import networkStateReducer from "@store/NetworkState";
import participantsReducer from "@store/Participants";
import selectedConversationReducer from "@store/SelectedConversation";
import userIsLoggedInReducer from "@store/UserIsLoggedIn";
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
    const { isMobileView, networkState } = state;
    state = { isMobileView, networkState };
  }

  return appReducer(state, action);
};

export default rootReducer;

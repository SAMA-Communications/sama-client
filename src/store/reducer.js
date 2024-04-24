import contextMenuReducer from "@store/values/ContextMenu";
import conversationsReducer from "@store/values/Conversations";
import currentUserReducer from "@store/values/CurrentUser";
import isMobileViewReducer from "@store/values/IsMobileView";
import isTabletViewReducer from "@store/values/IsTabletView";
import messageReducer from "@store/values/Messages";
import networkStateReducer from "@store/values/NetworkState";
import participantsReducer from "@store/values/Participants";
import selectedConversationReducer from "@store/values/SelectedConversation";
import userIsLoggedInReducer from "@store/values/UserIsLoggedIn";
import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  contextMenu: contextMenuReducer,
  conversations: conversationsReducer,
  currentUser: currentUserReducer,
  isMobileView: isMobileViewReducer,
  isTabletView: isTabletViewReducer,
  messages: messageReducer,
  networkState: networkStateReducer,
  participants: participantsReducer,
  selectedConversation: selectedConversationReducer,
  userIsLoggedIn: userIsLoggedInReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    const { isMobileView, isTabletView, networkState, currentUser } = state;
    state = { isMobileView, isTabletView, networkState, currentUser };
  }

  return appReducer(state, action);
};

export default rootReducer;

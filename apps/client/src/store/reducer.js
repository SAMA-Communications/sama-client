import { combineReducers } from "@reduxjs/toolkit";

import contextMenuReducer from "@store/values/ContextMenu";
import conversationsReducer from "@store/values/Conversations";
import currentUserIdReducer from "@store/values/CurrentUserId";
import isTabInFocusReducer from "@store/values/IsTabInFocus";
import messageReducer from "@store/values/Messages";
import networkStateReducer from "@store/values/NetworkState";
import participantsReducer from "@store/values/Participants";
import selectedConversationReducer from "@store/values/SelectedConversation";
import userIsLoggedInReducer from "@store/values/UserIsLoggedIn";

const appReducer = combineReducers({
  contextMenu: contextMenuReducer,
  conversations: conversationsReducer,
  currentUserId: currentUserIdReducer,
  isTabInFocus: isTabInFocusReducer,
  messages: messageReducer,
  networkState: networkStateReducer,
  participants: participantsReducer,
  selectedConversation: selectedConversationReducer,
  userIsLoggedIn: userIsLoggedInReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    const { isTabInFocus, networkState, currentUserId } = state;
    state = {
      isTabInFocus,
      networkState,
      currentUserId,
    };
  }

  return appReducer(state, action);
};

export default rootReducer;

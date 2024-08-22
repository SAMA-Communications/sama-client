import contextMenuReducer from "@store/values/ContextMenu";
import conversationsReducer from "@store/values/Conversations";
import currentUserIdReducer from "@store/values/CurrentUserId";
import encryptedUserReducer from "@store/values/EncryptedUser";
import isMobileViewReducer from "@store/values/IsMobileView";
import isTabInFocusReducer from "@store/values/IsTabInFocus";
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
  currentUserId: currentUserIdReducer,
  encryptedUser: encryptedUserReducer,
  isMobileView: isMobileViewReducer,
  isTabInFocus: isTabInFocusReducer,
  isTabletView: isTabletViewReducer,
  messages: messageReducer,
  networkState: networkStateReducer,
  participants: participantsReducer,
  selectedConversation: selectedConversationReducer,
  userIsLoggedIn: userIsLoggedInReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    const {
      isMobileView,
      isTabletView,
      isTabInFocus,
      networkState,
      currentUserId,
      encryptedUser,
    } = state;
    state = {
      isMobileView,
      isTabletView,
      isTabInFocus,
      networkState,
      currentUserId,
      encryptedUser,
    };
  }

  return appReducer(state, action);
};

export default rootReducer;

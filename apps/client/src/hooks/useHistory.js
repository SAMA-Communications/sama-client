import { setAllParams } from "@store/values/ContextMenu.js";
import {
  addPrefix,
  addSuffix,
  navigateTo,
  removeAndNavigateLastSection,
  removeAndNavigateSubLink,
} from "@utils/NavigationUtils.js";
import { history } from "@utils/history.js";

export default function useHistory() {
  const { pathname, hash, search } = history.location;
  const url = pathname + hash + search;

  const openProfileById = (uid) => {
    addSuffix(pathname + hash, `/user?uid=${uid}`);
  };

  const openContextMenuWithParams = (params) => {
    store.dispatch(setAllParams(params));
  };

  const undoLastSection = () => {
    removeAndNavigateLastSection(url);
  };

  const openEditWindow = (type) => {
    addSuffix(pathname + hash, `/edit?type=${type}`);
  };

  const openAddParticipantsWindow = () => {
    addSuffix(pathname + hash, "/add");
  };

  const undoSubLink = (path) => {
    removeAndNavigateSubLink(pathname + hash, path);
  };

  const openCurrentUserProfile = () => {
    addPrefix(pathname + hash, "/profile");
  };

  const closeChatInfoPage = () => {
    undoSubLink("/info");
  };

  const openEditConversationWindow = () => {
    openEditWindow("conversation");
  };

  const openEditUserProfileWindow = () => {
    openEditWindow("user");
  };

  const navigateToAuthPage = () => {
    navigateTo("/authorization");
  };

  const closeCurrentUserProfile = () => {
    undoSubLink("/profile");
  };

  return {
    openProfileById,
    openContextMenuWithParams,
    undoLastSection,
    openEditWindow,

    closeChatInfoPage,
    closeCurrentUserProfile,

    openCurrentUserProfile,
    openAddParticipantsWindow,
    openEditUserProfileWindow,
    openEditConversationWindow,

    navigateToAuthPage,
  };
}

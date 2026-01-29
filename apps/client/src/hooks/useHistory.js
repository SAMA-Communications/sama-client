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

  const openForwardSection = () => {
    navigateTo((pathname + hash).replace("selection", "forward"));
  };

  const closeSelectionMode = () => {
    removeSectionAndNavigate(pathname + hash, "/selection");
  };

  const openChatOrPaticipantInfo = (conversation, participant) => {
    const path = conversation?.type === "g" ? "/info" : "/user?uid=" + participant?._id;

    const tmpPath =
      tore.getState()?.isTablet?.value && path === "/info" && pathname.includes("/profile")
        ? currentPath.replace("/profile", "")
        : currentPath;

    (tmpPath.includes(path) ? removeAndNavigateLastSection : addSuffix)(tmpPath, path);
  };

  return {
    openProfileById,
    openContextMenuWithParams,
    undoLastSection,
    openEditWindow,

    closeChatInfoPage,
    closeCurrentUserProfile,
    closeSelectionMode,

    openCurrentUserProfile,
    openAddParticipantsWindow,
    openEditUserProfileWindow,
    openEditConversationWindow,
    openForwardSection,
    openChatOrPaticipantInfo,

    navigateToAuthPage,
  };
}

import { useViewportBreakpoints } from "@sama-communications.ui-kit";

import store from "@store/store.js";
import { setAllParams } from "@store/values/ContextMenu.js";

import { history } from "@utils/history.js";
import {
  addPrefix,
  addSuffix,
  navigateTo,
  removeAndNavigateLastSection,
  removeAndNavigateSubLink,
  removeSectionAndNavigate,
} from "@utils/NavigationUtils.js";

export default function useHistory() {
  const { pathname, hash, search } = history.location;
  const url = pathname + hash + (search || "");
  const { isTablet } = useViewportBreakpoints();

  const closeChatCompletely = () => {
    history.navigate(pathname + (search ? "?" + search : ""));
  };

  const openTabletListView = () => {
    if (!hash || hash.includes("/list")) return;
    const cid = hash.slice(1).split("/")[0];
    if (!cid) return;
    history.navigate(pathname + "#" + cid + "/list" + (search ? "?" + search : ""));
  };

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

    const tmpPath = isTablet && path === "/info" && pathname.includes("/profile") ? url.replace("/profile", "") : url;

    (tmpPath.includes(path) ? removeAndNavigateLastSection : addSuffix)(tmpPath, path);
  };

  const openAttachmentHub = () => {
    addSuffix(pathname + hash, "/attach");
  };

  const isLocationIncludeAttach = () => {
    return hash.includes("/attach");
  };

  return {
    openProfileById,
    openContextMenuWithParams,
    undoLastSection,

    closeChatInfoPage,
    closeCurrentUserProfile,
    closeSelectionMode,
    closeChatCompletely,

    openTabletListView,
    openCurrentUserProfile,
    openAddParticipantsWindow,
    openEditUserProfileWindow,
    openEditConversationWindow,
    openForwardSection,
    openChatOrPaticipantInfo,
    openAttachmentHub,

    isLocationIncludeAttach,

    navigateToAuthPage,
  };
}

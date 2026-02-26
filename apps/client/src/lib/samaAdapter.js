import { setAdapters } from "@sama-communications.ui-kit";

import useDrafts from "@hooks/useDrafts.js";
import useParticipants from "@hooks/useParticipants.js";
import useConversations from "@hooks/useConversations.js";
import useHistory from "@hooks/useHistory.js";
import useContextMenu from "@hooks/useContextMenu.js";
import useMessages from "@hooks/useMessages.js";

import { getLastMessageUserName, getUserFullName, getUserInitials, getLastVisitTime } from "@utils/UserUtils.js";
import { getLastUpdateTime } from "@utils/ConversationUtils.js";
import { getFileType, extractFilesFromClipboard } from "@utils/MediaUtils.js";
import { calcInputHeight, getFormatedTime } from "@utils/FormatedUtils.js";

setAdapters({
  useDrafts,
  useParticipants,
  useConversations,
  useHistory,
  useMessages,
  useContextMenu,

  userUtils: {
    getLastMessageUserName,
    getUserFullName,
    getUserInitials,
    getLastVisitTime,
  },
  conversationUtils: {
    getLastUpdateTime,
  },
  mediaUtils: {
    getFileType,
    extractFilesFromClipboard,
  },
  formatedUtils: {
    getFormatedTime,
    calcInputHeight,
  },
});

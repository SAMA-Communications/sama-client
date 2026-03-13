import { setAdapters } from "@sama-communications.ui-kit";

import useDrafts from "@hooks/api/useDrafts.js";
import useParticipants from "@hooks/api/useParticipants.js";
import useConversations from "@hooks/api/useConversations.js";
import useContextMenu from "@hooks/api/useContextMenu.js";
import useMessages from "@hooks/api/useMessages.js";

import { getLastMessageUserName, getUserFullName, getUserInitials, getLastVisitTime } from "@utils/UserUtils.js";
import { getLastUpdateTime } from "@utils/ConversationUtils.js";
import { getFileType, extractFilesFromClipboard } from "@utils/MediaUtils.js";
import { calcInputHeight, getFormatedTime } from "@utils/FormatedUtils.js";

setAdapters({
  useDrafts,
  useParticipants,
  useConversations,
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

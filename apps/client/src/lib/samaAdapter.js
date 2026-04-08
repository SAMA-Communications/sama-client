import useContextMenu from "@hooks/api/useContextMenu.js";
import useConversations from "@hooks/api/useConversations.js";
import useDrafts from "@hooks/api/useDrafts.js";
import useMessages from "@hooks/api/useMessages.js";
import useOpponentByCid from "@hooks/api/useOpponentByCid.js";
import useParticipants from "@hooks/api/useParticipants.js";

import { setAdapters } from "@sama-communications.ui-kit";

import { getLastUpdateTime } from "@utils/ConversationUtils.js";
import { calcInputHeight, getFormatedTime } from "@utils/FormatedUtils.js";
import { getFileType, extractFilesFromClipboard } from "@utils/MediaUtils.js";
import { getLastMessageUserName, getUserFullName, getUserInitials, getLastVisitTime } from "@utils/UserUtils.js";

setAdapters({
  useDrafts,
  useParticipants,
  useOpponentByCid,
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

import { setAdapters } from "@sama-communications.ui-kit";

import useDrafts from "@hooks/useDrafts.js";
import useParticipants from "@hooks/useParticipants.js";
import useConversations from "@hooks/useConversations.js";
import useHistory from "@hooks/useHistory.js";

import { getLastMessageUserName, getUserFullName, getUserInitials } from "@utils/UserUtils.js";
import { getLastUpdateTime } from "@utils/ConversationUtils.js";
import { getFileType } from "@utils/MediaUtils.js";

setAdapters({
  useDrafts,
  useParticipants,
  useConversations,
  useHistory,

  userUtils: {
    getLastMessageUserName,
    getUserFullName,
    getUserInitials,
  },
  conversationUtils: {
    getLastUpdateTime,
  },
  mediaUtils: {
    getFileType,
  },
});

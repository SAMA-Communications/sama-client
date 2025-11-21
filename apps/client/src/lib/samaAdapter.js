import { setAdapters } from "@sama-communications.ui-kit";

import useDrafts from "@hooks/useDrafts.js";
import useParticipants from "@hooks/useParticipants.js";
import useConversations from "@hooks/useConversations.js";

import { getLastMessageUserName, getUserFullName } from "@utils/UserUtils.js";
import { getLastUpdateTime } from "@utils/ConversationUtils.js";
import { getFileType } from "@utils/MediaUtils.js";

setAdapters({
  useDrafts,
  useParticipants,
  useConversations,

  userUtils: {
    getLastMessageUserName,
    getUserFullName,
  },
  conversationUtils: {
    getLastUpdateTime,
  },
  mediaUtils: {
    getFileType,
  },
});

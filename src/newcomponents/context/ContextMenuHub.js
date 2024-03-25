import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import conversationService from "@services/conversationsService";
import {
  getConverastionById,
  selectAllConversations,
} from "@store/values/Conversations";
import {
  selectContextExternalProps,
  selectContextList,
  selectCoords,
} from "@store/values/ContextMenu";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import "@newstyles/context/ContextMenuHub.css";

import AddParticipantsLink from "@newcomponents/context/elements/AddParticipantsLink";
import EditLink from "@newcomponents/context/elements/EditLink";
import InfoChatLink from "@newcomponents/context/elements/InfoChatLink";
import InfoUserLink from "@newcomponents/context/elements/InfoUserLink";
import LeaveAndDeleteLink from "@newcomponents/context/elements/LeaveAndDeleteLink";
import RemoveParticipantLink from "@newcomponents/context/elements/RemoveParticipantLink";
import SendMessageLink from "@newcomponents/context/elements/SendMessageLink";

export default function ContextMenuHub() {
  const { pathname, hash } = useLocation();
  const { type, opponent_id, owner_id } = useSelector(getConverastionById);
  const currentUser = useSelector(selectAllConversations);
  const currentPath = pathname + hash;
  const isCurrentUserOwner = currentUser._id === owner_id;

  const list = useSelector(selectContextList);
  const { userObject } = useSelector(selectContextExternalProps);
  const { x: left, y: top } = useSelector(selectCoords);

  const listView = useMemo(() => {
    const links = {
      infoChat: (
        <InfoChatLink
          key={"infoChat"}
          onClick={() =>
            addSuffix(
              currentPath,
              type === "g" ? "/info" : `/user?uid=${opponent_id}`
            )
          }
        />
      ),
      edit: (
        <EditLink
          key={"edit"}
          onClick={() => addSuffix(currentPath, "/edit?type=chat")}
        />
      ),
      infoUser: (
        <InfoUserLink
          key={"infoUser"}
          uId={userObject?._id}
          onClick={() => {
            isCurrentUserOwner
              ? addPrefix(currentPath, "/profile")
              : addSuffix(currentPath, `/user?uid=${userObject?._id}`);
          }}
        />
      ),
      addParticipants: (
        <AddParticipantsLink
          key={"addParticipants"}
          onClick={() => addSuffix(currentPath, "/add")}
        />
      ),
      leave: (
        <LeaveAndDeleteLink
          key={"leave"}
          onClick={() => conversationService.deleteConversation()}
        />
      ),
      removeParticipant: (
        <RemoveParticipantLink
          key={"removeParticipant"}
          onClick={() => conversationService.removeParticipant(userObject?._id)}
        />
      ),
      newChat: (
        <SendMessageLink
          key={"newChat"}
          uObject={userObject}
          onClick={() =>
            conversationService.createPrivateChat(userObject?._id, userObject)
          }
        />
      ),
    };

    return list.map((linkName) => links[linkName]).filter(Boolean);
  }, [list, userObject, currentPath, type, opponent_id, isCurrentUserOwner]);

  return (
    <div className="context-menu__container" style={{ top, left }}>
      {listView}
    </div>
  );
}

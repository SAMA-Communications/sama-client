import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectContextExternalProps,
  selectContextList,
  selectCoords,
} from "@store/values/ContextMenu";

import "@newstyles/context/ContextMenuHub.css";

import AddParticipantsLink from "@newcomponents/context/elements/AddParticipantsLink";
import EditLink from "@newcomponents/context/elements/EditLink";
import InfoChatLink from "@newcomponents/context/elements/InfoChatLink";
import InfoUserLink from "@newcomponents/context/elements/InfoUserLink";
import LeaveAndDeleteLink from "@newcomponents/context/elements/LeaveAndDeleteLink";
import RemoveParticipantLink from "@newcomponents/context/elements/RemoveParticipantLink";
import SendMessageLink from "@newcomponents/context/elements/SendMessageLink";

export default function ContextMenuHub() {
  const list = useSelector(selectContextList);
  const { userObject } = useSelector(selectContextExternalProps);
  const { x: left, y: top } = useSelector(selectCoords);

  const listView = useMemo(() => {
    const links = {
      infoChat: <InfoChatLink key={"infoChat"} />,
      edit: <EditLink key={"edit"} />,
      infoUser: <InfoUserLink key={"infoUser"} uId={userObject?._id} />,
      addParticipants: <AddParticipantsLink key={"addParticipants"} />,
      leave: <LeaveAndDeleteLink key={"leave"} />,
      removeParticipant: (
        <RemoveParticipantLink
          key={"removeParticipant"}
          uId={userObject?._id}
        />
      ),
      newChat: <SendMessageLink key={"newChat"} uObject={userObject} />,
    };

    return list.map((linkName) => links[linkName]).filter(Boolean);
  }, [list, userObject]);

  return (
    <div className="context-menu__container" style={{ top, left }}>
      {listView}
    </div>
  );
}

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ReactComponent as CloseButtonMini } from "@icons/chatForm/CloseButtonMini.svg";

export default function ParticipantInChatInfo({
  user,
  isCurrentUser,
  isCurrentUserOwner,
  isLockedDelete,
  deleteUserFunc,
}) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const deleteButton = useMemo(() => {
    if (isCurrentUser || !isCurrentUserOwner || isLockedDelete) {
      return null;
    }

    return <CloseButtonMini onClick={deleteUserFunc} />;
  }, [isCurrentUser, isLockedDelete, isCurrentUserOwner]);

  return (
    <div
      className="co-list-item"
      data-css={isCurrentUser ? "owner" : "opponent"}
      onClick={() => {
        if (isCurrentUser) {
          return;
        }
        navigate(pathname + hash + `/participant?uid=${user.native_id}`);
      }}
    >
      {user.login}
      {deleteButton}
    </div>
  );
}

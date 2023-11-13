import { history } from "../../../_helpers/history";
import { useLocation } from "react-router-dom";

export default function ParticipantInChatInfo({ user, isCurrentUser }) {
  const { pathname, hash } = useLocation();

  return (
    <div
      className="co-list-item"
      key={user._id}
      data-css={isCurrentUser ? "owner" : "opponent"}
      onClick={() => {
        if (isCurrentUser) {
          return;
        }
        history.navigate(pathname + hash + `/opponentinfo?uid=${user._id}`);
      }}
    >
      {user.login}
      {/* {isCurrentUser || !isOwner ? null : (
      <CloseButtonMini onClick={() => deleteUser(u._id)} />
    )} */}
    </div>
  );
}

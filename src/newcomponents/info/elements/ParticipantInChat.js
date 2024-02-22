import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { useLocation } from "react-router-dom";

export default function ParticipantInChat({
  userObject,
  isCurrentUser,
  isOwner,
}) {
  const { pathname, hash } = useLocation();

  return (
    <div
      className={`participant__box ${isCurrentUser ? "" : "cursor-pointer"}`}
      onClick={() => addSuffix(pathname + hash, `/user?uid=${userObject._id}`)}
    >
      <div className="participant__photo fcc">
        {getUserInitials(userObject)}
      </div>
      <div className="participant__info">
        <p>{getUserFullName(userObject)}</p>
        {isOwner ? <span>admin</span> : null}
      </div>
    </div>
  );
}

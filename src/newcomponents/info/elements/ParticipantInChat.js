import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setAllParams } from "@store/values/ContextMenu";

export default function ParticipantInChat({
  userObject,
  isOwner,
  isCurrentUserOwner,
}) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(selectCurrentUser);
  const isCurrentUser = currentUser._id === userObject._id;

  return (
    <div
      className={`participant__box`}
      onClick={() =>
        isOwner
          ? addPrefix(pathname + hash, "/profile")
          : addSuffix(pathname + hash, `/user?uid=${userObject._id}`)
      }
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(
          setAllParams({
            list: [
              "infoUser",
              isCurrentUser ? null : "newChat",
              !isCurrentUserOwner || isCurrentUser ? null : "removeParticipant",
            ],
            coords: { x: e.pageX, y: e.pageY },
            externalProps: { userObject },
            clicked: true,
          })
        );
      }}
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

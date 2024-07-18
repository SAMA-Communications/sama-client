import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { setAllParams } from "@store/values/ContextMenu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function ParticipantInChat({
  userObject,
  isOwner,
  isCurrentUserOwner,
}) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const currentUserId = useSelector(selectCurrentUserId);
  const isCurrentUser = currentUserId === userObject._id;

  return (
    <div
      className={`participant__box`}
      onClick={() =>
        isCurrentUser
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
        <DynamicAvatar
          avatarUrl={userObject.avatar_url}
          avatarBlurHash={userObject.avatar_object?.file_blur_hash}
          defaultIcon={userObject ? getUserInitials(userObject) : null}
        />
      </div>
      <div className="participant__info">
        <p>{getUserFullName(userObject)}</p>
        {isOwner ? <span>admin</span> : null}
      </div>
    </div>
  );
}

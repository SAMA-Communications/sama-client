import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import { setAllParams } from "@store/values/ContextMenu";
import { selectCurrentUserId } from "@store/values/CurrentUserId";

import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";

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
      className={`p-[10px] flex gap-[20px] items-center rounded-[12px] tensition-[background] duration-200 cursor-pointer hover:bg-(--color-accent-dark)`}
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
      <div className="w-[70px] h-[70px] text-h4 rounded-[8px] bg-(--color-bg-light) flex items-center justify-center overflow-hidden">
        <DynamicAvatar
          avatarUrl={userObject.avatar_url}
          avatarBlurHash={userObject.avatar_object?.file_blur_hash}
          defaultIcon={userObject ? getUserInitials(userObject) : null}
        />
      </div>
      <div className="flex-1 flex flex-col gap-[5px] overflow-hidden">
        <p className="text-black !font-medium text-h6 overflow-hidden text-ellipsis whitespace-nowrap">
          {getUserFullName(userObject)}
        </p>
        {isOwner ? <span className="text-black text-h6">admin</span> : null}
      </div>
    </div>
  );
}

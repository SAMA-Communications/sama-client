import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import { setAllParams } from "@store/values/ContextMenu";
import { selectCurrentUserId } from "@store/values/CurrentUserId";

import { addPrefix, addSuffix } from "@utils/NavigationUtils.js";
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
    <m.div
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
            category: "conversation",
            list: [
              "participantInfo",
              isCurrentUser ? null : "participantSendMessage",
              !isCurrentUserOwner || isCurrentUser
                ? null
                : "convRemoveParticipants",
            ],
            coords: { x: e.pageX, y: e.pageY },
            externalProps: { userObject },
            clicked: true,
          })
        );
      }}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scalle: 1 }}
      whileHover={{ y: -2, scale: 0.98, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
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
    </m.div>
  );
}

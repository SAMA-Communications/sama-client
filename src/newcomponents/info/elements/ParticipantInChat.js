import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setClicked, setCoords, setList } from "@store/values/ContextMenu";

export default function ParticipantInChat({ userObject, isOwner }) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

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
        dispatch(setCoords({ x: e.pageX, y: e.pageY }));
        dispatch(setList(["infoUser", "newChat", "removeParticipant"]));
        dispatch(setClicked(true));
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

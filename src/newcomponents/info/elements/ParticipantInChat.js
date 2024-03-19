import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { useContextMenu } from "@hooks/useContextMenu";
import { useLocation } from "react-router-dom";
import ContextMenuHub from "@newcomponents/context/ContextMenuHub";

export default function ParticipantInChat({ userObject, isOwner }) {
  const { pathname, hash } = useLocation();
  const { clicked, setClicked, coords, setCoords } = useContextMenu();

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
        e.stopPropagation();
        setClicked(true);
        setCoords({ x: e.nativeEvent.layerX, y: e.nativeEvent.layerY });
      }}
    >
      {clicked && (
        <ContextMenuHub
          top={coords.y}
          left={coords.x}
          listOfButtons={["info", "newChat", "removeParticipant"]}
        />
      )}
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

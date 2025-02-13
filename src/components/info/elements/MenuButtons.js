import addPrefix from "@utils/navigation/add_prefix";
import { setAllParams } from "@store/values/ContextMenu";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { ReactComponent as AccountIcon } from "@icons/Menu.svg";
import { ReactComponent as CreateChat } from "@icons/AddConversationBlack.svg";

export default function MenuButtons() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const openContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setAllParams({
        list: ["createGroupChat", "createEncryptedChat"],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
      })
    );
  };

  return (
    <>
      <AccountIcon
        className="navigation-account"
        onClick={() => addPrefix(pathname + hash, "/profile")}
      />
      <div
        className="navigation-create"
        onContextMenu={openContextMenu}
        onClick={openContextMenu}
      >
        <CreateChat />
      </div>
    </>
  );
}

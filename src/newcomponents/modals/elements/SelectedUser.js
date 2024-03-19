import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";

import { ReactComponent as Unselect } from "@icons/status/Unselect.svg";

export default function SelectedUser({ uObject, onClickFunc }) {
  return (
    <div className="selected-user__container" onClick={onClickFunc}>
      <div className="selected-user__photo fcc">
        <p>{getUserInitials(uObject)}</p>
        <Unselect />
      </div>
      <p>{getUserFullName(uObject)}</p>
    </div>
  );
}

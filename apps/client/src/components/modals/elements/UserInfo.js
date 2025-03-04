import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";

import Unselect from "@icons/status/Unselect.svg?react";

export default function UserInfo({ uObject, onClickFunc }) {
  return (
    <div className="user-info__container" onClick={onClickFunc}>
      <div className="user-info__photo fcc">
        <p>{getUserInitials(uObject)}</p>
        <Unselect />
      </div>
      <p>{getUserFullName(uObject)}</p>
    </div>
  );
}

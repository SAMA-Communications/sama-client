import getUserFullTime from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";

import "@newstyles/search/elements/SearchedUser.css";

export default function SearchedUser({ uObject }) {
  return (
    <div className="searched-user fcc">
      <div className="searched-user__photo fcc">{getUserInitials(uObject)}</div>
      <p className="searched-user__name">{getUserFullTime(uObject)}</p>
    </div>
  );
}

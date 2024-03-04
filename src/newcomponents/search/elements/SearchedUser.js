import addSuffix from "@utils/navigation/add_suffix";
import conversationService from "@services/conversationsService";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { addUsers } from "@store/values/Participants";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import "@newstyles/search/elements/SearchedUser.css";

export default function SearchedUser({
  uObject,
  clearInputText,
  isClearInputText,
  isPreviewUserProfile,
}) {
  const { pathname, hash } = useLocation();
  const dispatch = useDispatch();

  const onClickFunc = async () => {
    isClearInputText && clearInputText();

    if (isPreviewUserProfile) {
      dispatch(addUsers([uObject]));
      addSuffix(pathname + hash, `/user?uid=${uObject._id}`);
      return;
    }
    await conversationService.createPrivateChat(uObject._id, uObject);
  };

  return (
    <div className="searched-user fcc" onClick={onClickFunc}>
      <div className="searched-user__photo fcc">{getUserInitials(uObject)}</div>
      <p className="searched-user__name">{getUserFullName(uObject)}</p>
    </div>
  );
}

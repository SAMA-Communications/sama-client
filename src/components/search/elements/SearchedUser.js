import addSuffix from "@utils/navigation/add_suffix";
import conversationService from "@services/conversationsService";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";
import { addUsers } from "@store/values/Participants";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import "@styles/search/elements/SearchedUser.css";

import { ReactComponent as Selected } from "@icons/status/Selected.svg";

export default function SearchedUser({
  uObject,
  clearInputText,
  addUserToArray,
  removeUserFromArray,
  isSelected = false,
  isClickDisabled = false,
  isClearInputText = false,
  isSelectUserToArray = false,
  isPreviewUserProfile = false,
}) {
  const { pathname, hash } = useLocation();
  const dispatch = useDispatch();

  const onClickFunc = async () => {
    if (isClickDisabled) {
      return;
    }

    isClearInputText && clearInputText();

    if (isPreviewUserProfile) {
      dispatch(addUsers([uObject]));
      addSuffix(pathname + hash, `/user?uid=${uObject._id}`);
      return;
    }

    if (isSelectUserToArray) {
      (isSelected ? removeUserFromArray : addUserToArray)(uObject);
      return;
    }

    const chatId = await conversationService.createPrivateChat(
      uObject._id,
      uObject
    );
    navigateTo(`/#${chatId}`);
  };

  return (
    <div className="searched-user fcc" onClick={onClickFunc}>
      <div className="searched-user__photo fcc">
        {getUserInitials(uObject)}
        {isSelected ? (
          <div className="searched-user__indecator fcc">
            <Selected />
          </div>
        ) : null}
      </div>
      <p className="searched-user__name">{getUserFullName(uObject)}</p>
    </div>
  );
}

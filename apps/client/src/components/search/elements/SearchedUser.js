import * as m from "motion/react-m";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

import conversationService from "@services/conversationsService";

import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import { addUsers } from "@store/values/Participants";

import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";
import addSuffix from "@utils/navigation/add_suffix";

import Selected from "@icons/status/Selected.svg?react";

export default function SearchedUser({
  index,
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
    <m.div
      className="w-[400px] p-[10px] gap-[15px] justify-start rounded-[12px] flex items-center hover:bg-(--color-hover-light) max-md:w-full cursor-pointer"
      onClick={onClickFunc}
      initial={{ opacity: 0, x: -10 }}
      exit={{ x: 10, opacity: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      layout
    >
      <div className="relative w-[70px] h-[70px] !font-light text-h4 rounded-[8px] bg-(--color-bg-dark) flex items-center justify-center text-(--color-text-dark) overflow-hidden">
        <DynamicAvatar
          avatarUrl={uObject.avatar_url}
          avatarBlurHash={uObject.avatar_object?.file_blur_hash}
          defaultIcon={getUserInitials(uObject)}
          altText={"User's Profile"}
        />
        {isSelected ? (
          <div className="absolute bottom-[3px] right-[3px] w-[20px] h-[20px] rounded-full bg-(--color-accent-dark) flex items-center justify-center z-10">
            <Selected />
          </div>
        ) : null}
      </div>
      <p className="flex-1 text-h6 !font-medium text-black overflow-hidden overflow-ellipsis whitespace-nowrap">
        {getUserFullName(uObject)}
      </p>
    </m.div>
  );
}

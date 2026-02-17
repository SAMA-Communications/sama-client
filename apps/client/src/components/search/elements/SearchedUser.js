import * as m from "motion/react-m";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

import conversationService from "@services/conversationsService";

import { DynamicAvatar } from "@sama-communications.ui-kit";

import { addUsers } from "@store/values/Participants";

import { addSuffix, navigateTo } from "@utils/NavigationUtils.js";
import { getUserFullName, getUserInitials } from "@utils/UserUtils.js";

import Selected from "@icons/status/Selected.svg?react";

export default function SearchedUser({
  index,
  uObject,
  clearInputText,
  addUserToArray,
  removeUserFromArray,
  additionalOnClickfunc,
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

    const chatId = await conversationService.createPrivateChat(uObject._id, uObject);
    navigateTo(`/#${chatId}`);

    additionalOnClickfunc && additionalOnClickfunc(chatId);
  };

  return (
    <m.div
      className="flex w-[400px] cursor-pointer items-center justify-start gap-[15px] rounded-[12px] p-[10px] hover:bg-(--color-hover-light) max-md:w-full"
      onClick={onClickFunc}
      initial={{ opacity: 0, x: -10 }}
      exit={{ x: 10, opacity: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      layout
    >
      <DynamicAvatar
        size={70}
        avatarUrl={uObject.avatar_url}
        avatarBlurHash={uObject.avatar_object?.file_blur_hash}
        defaultIcon={getUserInitials(uObject)}
        altText={"User's Profile"}
      />
      {isSelected ? (
        <div className="absolute right-[3px] bottom-[3px] z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-(--color-accent-500)">
          <Selected />
        </div>
      ) : null}
      <p className="text-h6 flex-1 overflow-hidden !font-medium overflow-ellipsis whitespace-nowrap text-black">
        {getUserFullName(uObject)}
      </p>
    </m.div>
  );
}

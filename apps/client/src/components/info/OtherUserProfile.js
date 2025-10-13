import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

import api from "@api/api";

import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";
import { useKeyDown } from "@hooks/useKeyDown";

import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import InfoBox from "@components/info/elements/InfoBox";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import {
  addUser,
  selectParticipantsEntities,
} from "@store/values/Participants.js";
import { getIsMobileView } from "@store/values/IsMobileView";

import {
  navigateTo,
  removeAndNavigateLastSection,
} from "@utils/NavigationUtils.js";
import extractUserIdFromUrl from "@utils/user/extract_user_id_from_url";
import getUserFullName from "@utils/user/get_user_full_name";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@utils/global/keyCodes";

import {
  showOtherUserProfileContainer,
  showOtherUserProfileContent,
} from "@animations/aOtherUserProfile.js";

import Close from "@icons/actions/CloseGray.svg?react";
import LinkTo from "@icons/options/LinkTo.svg?react";
import BackBtn from "@icons/options/Back.svg?react";
import UserIcon from "@icons/users/ProfileIcon.svg?react";

export default function OtherUserProfile() {
  const dispatch = useDispatch();
  const { pathname, hash, search } = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const participants = useSelector(selectParticipantsEntities);

  const [userObject, setUserObject] = useState({});
  const { _id: userId, login, email, phone } = userObject;

  useEffect(() => {
    const uid = extractUserIdFromUrl(pathname + hash + search);
    if (!uid) return;
    let user = participants[uid];

    if (!user) {
      api.getUsersByIds({ ids: [uid] }).then((users) => {
        user = users?.[0];
        if (user) {
          setUserObject(user);
          dispatch(addUser(user));
          return;
        }

        removeAndNavigateLastSection(pathname + hash, "/profile");
        showCustomAlert("This user no longer exists.", "warning");
      });
      return;
    }
    setUserObject(user);
  }, [pathname, hash, search, participants]);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateLastSection(pathname + hash, "/profile")
  );

  const viewStatusActivity = useMemo(
    () => activityService.getUserLastActivity(userId),
    [userId, participants]
  );

  return (
    <m.div
      className="absolute top-[0px] left-[0px] p-[30px] w-dvw h-dvh flex flex-col justify-start items-center bg-(--color-black)/50 z-[200] max-md:p-[0px] max-md:bg-(--color-bg-dark) overflow-hidden"
      variants={showOtherUserProfileContainer(isMobileView)}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition="transition"
    >
      <m.div
        className="w-[400px] h-full mr-[15px] max-md:w-dvw max-md:h-dvh max-md:mr-[0px]"
        variants={showOtherUserProfileContent(isMobileView)}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition="transition"
      >
        <CustomScrollBar childrenClassName="py-[20px] flex flex-col gap-[15px] max-md:py-[0px]">
          <div className="relative flex flex-col justify-center items-center py-[40px] gap-[20px] rounded-[32px] bg-(--color-accent-light) max-md:rounded-t-[0px]">
            {isMobileView ? (
              <BackBtn
                className="absolute right-[30px] top-[30px] cursor-pointer max-md:left-[4svw] max-md:top-[34px]"
                onClick={() => removeAndNavigateLastSection(pathname + hash)}
              />
            ) : (
              <Close
                className="absolute top-[30px] right-[30px] cursor-pointer"
                onClick={() => removeAndNavigateLastSection(pathname + hash)}
              />
            )}
            <div className="relative w-[160px] h-[160px] rounded-[24px] bg-(--color-bg-light) flex justify-center items-center cursor-pointer overflow-hidden">
              <DynamicAvatar
                avatarUrl={userObject.avatar_url}
                avatarBlurHash={userObject.avatar_object?.file_blur_hash}
                defaultIcon={<UserIcon />}
                altText={"User's Profile"}
              />
            </div>
            <div className="w-[90%]">
              <p className="mt-[-5px] text-center !font-medium text-h3 text-black overflow-hidden text-ellipsis whitespace-nowrap">
                {getUserFullName(userObject)}
              </p>
              <p className="mt-[10px] mb-[-10px] text-center text-h6">
                {viewStatusActivity}
              </p>
            </div>
          </div>
          <div className="py-[30px] px-[20px] flex flex-col rounded-[32px] bg-(--color-bg-light) max-md:flex-1 max-md:rounded-b-[0px]">
            <p className="text-center !font-normal text-h5 text-(--color-text-dark) mb-[10px]">
              Personal information
            </p>
            <InfoBox
              modifier={"!cursor-default"}
              iconType={"login"}
              title={"Username"}
              value={login}
              hideIfNull={true}
            />
            <InfoBox
              modifier={"!cursor-default"}
              iconType={"phone"}
              title={"Mobile phone"}
              value={phone}
              hideIfNull={true}
            />
            <InfoBox
              modifier={"!cursor-default"}
              iconType={"email"}
              title={"Email address"}
              value={email}
              hideIfNull={true}
            />
            <div className="flex items-center gap-[10px] px-[10px] cursor-pointer mt-[10px]">
              <LinkTo />
              <p
                className="text-(--color-accent-dark) text-h6"
                onClick={async () => {
                  const chatId = await conversationService.createPrivateChat(
                    userId
                  );
                  navigateTo(`/#${chatId}`);
                }}
              >
                Start a conversation
              </p>
            </div>
          </div>
        </CustomScrollBar>
      </m.div>
    </m.div>
  );
}

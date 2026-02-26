import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

import api from "@api/api";

import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";
import { useKeyDown } from "@hooks/tools/useKeyDown";

import { CustomScrollBar, InfoBox, DynamicAvatar } from "@sama-communications.ui-kit";

import { addUser, selectParticipantsEntities } from "@store/values/Participants.js";
import { getIsMobileView } from "@store/values/IsMobileView";

import { extractUserIdFromUrl, getUserFullName } from "@utils/UserUtils.js";
import { navigateTo, removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { showOtherUserProfileContainer, showOtherUserProfileContent } from "@utils/AnimationUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { KEY_CODES } from "@utils/constants.js";

import { User, Reply } from "lucide-react";

import Close from "@icons/actions/CloseGray.svg?react";
import LinkTo from "@icons/options/LinkTo.svg?react";
import BackBtn from "@icons/options/Back.svg?react";

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
  useKeyDown(KEY_CODES.ESCAPE, () => removeAndNavigateLastSection(pathname + hash, "/profile"));

  const viewStatusActivity = useMemo(() => activityService.getUserLastActivity(userId), [userId, participants]);

  return (
    <m.div
      className="absolute top-[0px] left-[0px] z-[200] flex h-dvh w-dvw flex-col items-center justify-start overflow-hidden bg-(--color-black)/50 p-[30px] max-md:bg-(--color-bg-dark) max-md:p-[0px]"
      variants={showOtherUserProfileContainer(isMobileView)}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition="transition"
    >
      <m.div
        className="mr-[15px] h-full w-[400px] max-md:mr-[0px] max-md:h-dvh max-md:w-dvw"
        variants={showOtherUserProfileContent(isMobileView)}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition="transition"
      >
        <CustomScrollBar childrenClassName="py-[20px] flex flex-col gap-[15px] max-md:py-[0px]">
          <div className="relative flex flex-col items-center justify-center gap-[20px] rounded-[32px] bg-(--color-accent-100) py-[40px] max-md:rounded-t-[0px]">
            {isMobileView ? (
              <BackBtn
                className="absolute top-[30px] right-[30px] cursor-pointer max-md:top-[34px] max-md:left-[4svw]"
                onClick={() => removeAndNavigateLastSection(pathname + hash)}
              />
            ) : (
              <Close
                className="absolute top-[30px] right-[30px] cursor-pointer"
                onClick={() => removeAndNavigateLastSection(pathname + hash)}
              />
            )}
            <DynamicAvatar
              size={160}
              avatarUrl={userObject.avatar_url}
              avatarBlurHash={userObject.avatar_object?.file_blur_hash}
              defaultIcon={<User size={80} color="white" />}
              altText={"User's Profile"}
            />
            <div className="w-[90%]">
              <p className="mt-[-5px] overflow-hidden text-center text-2xl font-medium text-ellipsis whitespace-nowrap text-black">
                {getUserFullName(userObject)}
              </p>
              <p className="text-md text-text-dark mt-[10px] mb-[-10px] text-center font-light">{viewStatusActivity}</p>
            </div>
          </div>
          <div className="flex flex-col rounded-[32px] bg-(--color-bg-light) px-[20px] py-[30px] max-md:flex-1 max-md:rounded-b-[0px]">
            <p className="mb-[10px] text-center text-xl !font-normal text-(--color-text-dark)">Personal information</p>
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
            <div className="mt-[10px] flex cursor-pointer items-center gap-[10px] px-2">
              <Reply size={18} color="var(--color-accent-500)" />
              <p
                className="text-h6 text-accent-500"
                onClick={async () => {
                  const chatId = await conversationService.createPrivateChat(userId);
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

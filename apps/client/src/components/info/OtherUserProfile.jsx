import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

import api from "@api/api";

import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";
import { useKeyDown } from "@hooks/tools/useKeyDown";

import { OtherUserProfile as UIOtherUserProfile } from "@sama-communications.ui-kit";

import { addUser, selectParticipantsEntities } from "@store/values/Participants.js";
import { getIsMobileView } from "@store/values/IsMobileView";

import { extractUserIdFromUrl, getUserFullName } from "@utils/UserUtils.js";
import { navigateTo, removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { showOtherUserProfileContainer, showOtherUserProfileContent } from "@utils/AnimationUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { KEY_CODES } from "@utils/constants.js";

import { ArrowLeft, X } from "lucide-react";

export default function OtherUserProfile() {
  const dispatch = useDispatch();
  const { pathname, hash, search } = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const participants = useSelector(selectParticipantsEntities);

  const [userObject, setUserObject] = useState({});
  const { _id: userId } = userObject;

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
  }, [pathname, hash, search, participants, dispatch]);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () => removeAndNavigateLastSection(pathname + hash, "/profile"));

  const viewStatusActivity = useMemo(
    () => (userId ? activityService.getUserLastActivity(userId) : ""),
    [userId, participants],
  );

  const handleStartConversation = async () => {
    if (!userId) return;
    const chatId = await conversationService.createPrivateChat(userId);
    navigateTo(`/#${chatId}`);
  };

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
        <UIOtherUserProfile
          user={userObject}
          displayName={getUserFullName(userObject) || "Unknown"}
          statusActivity={viewStatusActivity}
          isMobile={isMobileView}
          onClose={() => removeAndNavigateLastSection(pathname + hash)}
          onBack={() => removeAndNavigateLastSection(pathname + hash)}
          onStartConversation={handleStartConversation}
          contentClassName="py-[20px] flex flex-col gap-[15px] max-md:py-[0px]"
          closeButton={isMobileView ? null : <X className="cursor-pointer" />}
          backButton={
            isMobileView ? <ArrowLeft className="cursor-pointer max-md:top-[34px] max-md:left-[4svw]" /> : null
          }
        />
      </m.div>
    </m.div>
  );
}

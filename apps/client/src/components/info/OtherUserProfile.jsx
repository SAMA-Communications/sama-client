import { useEffect, useState } from "react";

import { useLocation } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { ArrowLeft, X } from "lucide-react";
import * as m from "motion/react-m";

import api from "@api/api";

import { useKeyDown } from "@hooks/tools/useKeyDown";

import { OtherUserProfile as UIOtherUserProfile, useViewportBreakpoints } from "@sama-communications.ui-kit";

import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";

import { addUser, selectParticipantLastActivityById, selectParticipantsEntities } from "@store/values/Participants.js";

import { showOtherUserProfileContainer, showOtherUserProfileContent } from "@utils/AnimationUtils.js";
import { KEY_CODES } from "@utils/constants.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { navigateTo, removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { extractUserIdFromUrl, getLastVisitTime, getUserFullName } from "@utils/UserUtils.js";

export default function OtherUserProfile({ view: viewProp = "compact" }) {
  const dispatch = useDispatch();
  const { pathname, hash, search } = useLocation();

  const { isMobile: isMobileView } = useViewportBreakpoints();
  const participants = useSelector(selectParticipantsEntities);

  const [userObject, setUserObject] = useState({});
  const userId = userObject._id;
  const opponentLastActivity = useSelector((state) => selectParticipantLastActivityById(state, userId));

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

  useEffect(() => {
    if (!userId) return;

    const alreadySubscribedViaChat = activityService.isSelectedPrivateChatWithUser(userId);
    let effectDisposed = false;
    if (!alreadySubscribedViaChat) {
      activityService.fetchAndApplyUserActivity(userId, () => effectDisposed);
    }

    return () => {
      effectDisposed = true;
      activityService.unsubscribeProfileActivityIfNeeded(userId);
    };
  }, [userId]);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () => removeAndNavigateLastSection(pathname + hash, "/profile"));

  const viewStatusActivity = () => {
    if (!userId) return "";
    if (opponentLastActivity === 0) return <span className="text-h5 text-accent-500">online</span>;
    return getLastVisitTime(opponentLastActivity);
  };

  const handleStartConversation = async () => {
    if (!userId) return;
    const chatId = await conversationService.createPrivateChat(userId);
    navigateTo(`/#${chatId}`);
  };

  const handleClose = () => removeAndNavigateLastSection(pathname + hash);
  const isCardView = viewProp === "card";

  const uiProfileProps = {
    user: userObject,
    view: viewProp,
    displayName: getUserFullName(userObject) || "Unknown",
    statusActivity: viewStatusActivity(),
    isMobile: isMobileView,
    onClose: handleClose,
    onBack: handleClose,
    onStartConversation: handleStartConversation,
    contentClassName: "py-[20px] flex flex-col gap-[15px] max-md:py-[0px]",
    closeButton: isMobileView ? null : <X className="cursor-pointer" />,
    backButton: isMobileView ? <ArrowLeft className="cursor-pointer max-md:top-[34px] max-md:left-[4svw]" /> : null,
  };

  if (!isCardView) {
    return (
      <div className="bg-bg-light flex h-full min-h-0 w-full flex-col">
        <UIOtherUserProfile {...uiProfileProps} />
      </div>
    );
  }

  return (
    <m.div
      className="max-md:bg-bg-dark absolute top-0 left-0 z-200 flex h-dvh w-dvw flex-col items-center justify-start overflow-hidden bg-black/50 p-7.5 max-md:p-0"
      variants={showOtherUserProfileContainer(isMobileView)}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition="transition"
    >
      <m.div
        className="max-md:mr- h-full w-[400px] max-md:h-dvh max-md:w-dvw"
        variants={showOtherUserProfileContent(isMobileView)}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition="transition"
      >
        <UIOtherUserProfile {...uiProfileProps} />
      </m.div>
    </m.div>
  );
}

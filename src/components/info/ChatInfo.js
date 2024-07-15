import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import ParticipantInChat from "@components/info/elements/ParticipantInChat";
import addSuffix from "@utils/navigation/add_suffix";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@helpers/keyCodes";
import { getConverastionById } from "@store/values/Conversations";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion as m } from "framer-motion";
import {
  animateUserProfilecontainer,
  animateUserProfileContent,
} from "@src/animations/animateUserProfile";

import "@styles/info/ChatInfo.css";

import { ReactComponent as AddParticipants } from "@icons/AddParticipants.svg";
import { ReactComponent as BackBtn } from "@icons/options/Back.svg";
import { ReactComponent as Close } from "@icons/actions/CloseGray.svg";
import { ReactComponent as ImageBig } from "@icons/media/ImageBig.svg";

export default function ChatInfo() {
  const { pathname, hash } = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const isTabletView = useSelector(getIsTabletView);

  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const conversationOwner = selectedConversation?.owner_id?.toString();

  const isCurrentUserOwner = useMemo(() => {
    if (!currentUserId || !selectedConversation) {
      return false;
    }
    return currentUserId === selectedConversation.owner_id?.toString();
  }, [currentUserId, selectedConversation]);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateSubLink(pathname + hash, "/info")
  );

  const participantsList = useMemo(() => {
    if (!selectedConversation?.participants || !currentUserId) {
      return null;
    }

    return selectedConversation.participants.map((uId, i) => {
      const userObject = participants[uId];
      if (!userObject) {
        return null;
      }

      const isOwner = userObject._id === conversationOwner;

      return (
        <ParticipantInChat
          key={uId}
          index={i}
          userObject={userObject}
          isOwner={isOwner}
          isCurrentUserOwner={isCurrentUserOwner}
          isAnimate={true}
        />
      );
    });
  }, [selectedConversation, participants, currentUserId]);

  const participantsCount = participantsList?.length;

  return (
    <m.div
      className="chat-info__container"
      variants={animateUserProfilecontainer}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <CustomScrollBar>
        <div className="chat-info__container--top fcc">
          <m.div
            className="ci-top__title"
            variants={animateUserProfileContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Chat info
          </m.div>
          {isMobileView ? (
            <BackBtn
              className="ci-close"
              onClick={() => removeAndNavigateSubLink(pathname + hash, "/info")}
            />
          ) : (
            <Close
              className="ci-close"
              onClick={() => removeAndNavigateSubLink(pathname + hash, "/info")}
            />
          )}
          <m.div
            className="ci-photo fcc"
            variants={animateUserProfileContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ImageBig />
          </m.div>
          <m.div
            variants={animateUserProfileContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`chat-info__content ${
              isCurrentUserOwner ? "cursor-pointer" : ""
            }`}
            onClick={() => addSuffix(pathname + hash, "/edit?type=chat")}
          >
            <p className="ci-name">
              {selectedConversation?.name || (
                <span className="ci-name--gray">Group name</span>
              )}
            </p>
            <p className="ci-description">
              {selectedConversation?.description || (
                <span className="ci-description--gray">Description</span>
              )}
            </p>
          </m.div>
        </div>
        <div className="chat-info__container--bottom">
          <m.div
            className="ci-bottom__header"
            variants={animateUserProfileContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="ci-header__text">
              {participantsCount} member{participantsCount > 1 ? "s" : ""}
            </p>
            {isCurrentUserOwner ? (
              <AddParticipants
                className="ci-addparticipants"
                onClick={() => addSuffix(pathname + hash, "/add")}
              />
            ) : null}
          </m.div>
          <CustomScrollBar
            autoHeight={isMobileView || isTabletView ? true : false}
            autoHeightMax={isMobileView || isTabletView ? 400 : 0}
          >
            {participantsList}
          </CustomScrollBar>
        </div>
      </CustomScrollBar>
    </m.div>
  );
}

import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import ParticipantInChat from "@components/info/elements/ParticipantInChat";
import addSuffix from "@utils/navigation/add_suffix";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@helpers/keyCodes";
import { getConverastionById } from "@store/values/Conversations";
import { getIsMobileView } from "@store/values/IsMobileView";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import "@styles/info/ChatInfo.css";

import { ReactComponent as AddParticipants } from "@icons/AddParticipants.svg";
import { ReactComponent as BackBtn } from "@icons/options/Back.svg";
import { ReactComponent as Close } from "@icons/actions/CloseGray.svg";
import { ReactComponent as ImageBig } from "@icons/media/ImageBig.svg";

export default function ChatInfo() {
  const { pathname, hash } = useLocation();

  const isMobileView = useSelector(getIsMobileView);

  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(selectCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const conversationOwner = selectedConversation?.owner_id?.toString();

  const isCurrentUserOwner = useMemo(() => {
    if (!currentUser || !selectedConversation) {
      return false;
    }
    return currentUser._id === selectedConversation.owner_id?.toString();
  }, [currentUser, selectedConversation]);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateSubLink(pathname + hash, "/info")
  );

  const participantsList = useMemo(() => {
    if (!selectedConversation?.participants || !currentUser) {
      return null;
    }

    return selectedConversation.participants.map((uId) => {
      const userObject = participants[uId];
      if (!userObject) {
        return null;
      }

      const isOwner = userObject._id === conversationOwner;

      return (
        <ParticipantInChat
          key={uId}
          userObject={userObject}
          isOwner={isOwner}
          isCurrentUserOwner={isCurrentUserOwner}
        />
      );
    });
  }, [selectedConversation, participants, currentUser]);

  const participantsCount = participantsList?.length;

  return (
    <div className="chat-info__container">
      <div className="chat-info__container--top fcc">
        <div className="ci-top__title">Chat info</div>
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
        <div className="ci-photo fcc">
          <ImageBig />
        </div>
        <div
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
        </div>
      </div>
      <div className="chat-info__container--bottom">
        <div className="ci-bottom__header">
          <p className="ci-header__text">
            {participantsCount} member{participantsCount > 1 ? "s" : ""}
          </p>
          {isCurrentUserOwner ? (
            <AddParticipants
              className="ci-addparticipants"
              onClick={() => addSuffix(pathname + hash, "/add")}
            />
          ) : null}
        </div>
        <CustomScrollBar>{participantsList}</CustomScrollBar>
      </div>
    </div>
  );
}

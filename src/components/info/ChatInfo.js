import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import ParticipantInChat from "@components/info/elements/ParticipantInChat";
import addSuffix from "@utils/navigation/add_suffix";
import conversationService from "@services/conversationsService";
import globalConstants from "@helpers/constants";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@helpers/keyCodes";
import { getConverastionById } from "@store/values/Conversations";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import "@styles/info/ChatInfo.css";

import AddParticipants from "@icons/AddParticipants.svg?react";
import BackBtn from "@icons/options/Back.svg?react";
import Close from "@icons/actions/CloseGray.svg?react";
import ImageBig from "@icons/media/ImageBig_latest.svg?react";
import ImageOwnerBig from "@icons/media/ImageBig.svg?react";

export default function ChatInfo() {
  const { pathname, hash } = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const isTabletView = useSelector(getIsTabletView);

  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const conversationOwner = selectedConversation.owner_id?.toString();

  const inputFilesRef = useRef(null);

  const isCurrentUserOwner = useMemo(() => {
    if (!currentUserId || !selectedConversation) {
      return false;
    }
    return currentUserId === selectedConversation.owner_id?.toString();
  }, [currentUserId, selectedConversation]);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());

  const participantsList = useMemo(() => {
    if (!selectedConversation.participants || !currentUserId) {
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
  }, [selectedConversation, participants, currentUserId]);

  const participantsCount = participantsList?.length;

  const pickFileClick = () =>
    isCurrentUserOwner ? inputFilesRef.current.click() : {};

  const sendChangeAvatarRequest = async (file) =>
    void (await conversationService.updateChatImage(file));

  return (
    <div className="chat-info__container">
      <CustomScrollBar>
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
          <div
            className={`ci-photo${
              isCurrentUserOwner ? "--owner cursor-pointer" : ""
            } fcc`}
            onClick={pickFileClick}
          >
            <DynamicAvatar
              avatarUrl={selectedConversation.image_url}
              avatarBlurHash={selectedConversation.image_object?.file_blur_hash}
              defaultIcon={
                isCurrentUserOwner ? <ImageOwnerBig /> : <ImageBig />
              }
              altText={"Chat Group"}
            />
            <input
              id="inputFile"
              ref={inputFilesRef}
              type="file"
              onChange={(e) =>
                sendChangeAvatarRequest(Array.from(e.target.files).at(0))
              }
              accept={globalConstants.allowedAvatarFormats}
              multiple
            />
          </div>
          <div
            className={`chat-info__content ${
              isCurrentUserOwner ? "cursor-pointer" : ""
            }`}
            onClick={() =>
              isCurrentUserOwner
                ? addSuffix(pathname + hash, "/edit?type=chat")
                : null
            }
          >
            <p className="ci-name">
              {selectedConversation.name || (
                <span className="ci-name--gray">Group name</span>
              )}
            </p>
            <p className="ci-description">
              {selectedConversation.description || (
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
          <CustomScrollBar
            autoHeight={isMobileView || isTabletView ? true : false}
            autoHeightMax={isMobileView || isTabletView ? 400 : 0}
          >
            {participantsList}
          </CustomScrollBar>
        </div>
      </CustomScrollBar>
    </div>
  );
}

import { useLocation } from "react-router";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { motion as m } from "framer-motion";

import { useKeyDown } from "@hooks/useKeyDown";

import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import ParticipantInChat from "@components/info/elements/ParticipantInChat";

import { getConverastionById } from "@store/values/Conversations";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";

import addSuffix from "@utils/navigation/add_suffix";
import conversationService from "@services/conversationsService";
import globalConstants from "@utils/global/constants";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@utils/global/keyCodes";

import {
  showChatInfoContainer,
  showChatInfoContent,
} from "@animations/aChatInfo.js";

import AddParticipants from "@icons/AddParticipants.svg?react";
import BackBtn from "@icons/options/Back.svg?react";
import Close from "@icons/actions/CloseGray.svg?react";
import ImageBig from "@icons/media/ImageBig_latest.svg?react";
import ImageOwnerBig from "@icons/media/ImageBig.svg?react";

export default function ChatInfo({ shareRef }) {
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
    <m.div
      ref={shareRef}
      className="md:w-[400px] max-md:!w-dvw shrink md:my-[20px] md:mr-[20px] "
      variants={showChatInfoContainer(isMobileView)}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <CustomScrollBar childrenClassName="flex flex-col gap-[15px]">
        <div className="py-[30px] flex-col gap-[20px] rounded-[32px] bg-(--color-bg-light) flex items-center justify-center max-md:rounded-t-[0px] max-md:rounded-b-[16px]">
          <m.div
            className="mb-[10px] text-center !font-normal text-h5 text-black"
            variants={showChatInfoContent(isMobileView)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Chat info
          </m.div>
          {isMobileView ? (
            <BackBtn
              className="absolute right-[30px] top-[30px] cursor-pointer max-md:left-[4svw] max-md:top-[34px]"
              onClick={() => removeAndNavigateSubLink(pathname + hash, "/info")}
            />
          ) : (
            <Close
              className="absolute right-[30px] top-[30px] cursor-pointer max-md:left-[4svw] max-md:top-[34px]"
              onClick={() => removeAndNavigateSubLink(pathname + hash, "/info")}
            />
          )}
          <m.div
            className={`relative w-[160px] h-[160px] max-md:w-[120px] max-md:h-[120px] rounded-[24px] bg-(--color-bg-dark) flex items-center justify-center overflow-hidden`}
            onClick={pickFileClick}
            variants={showChatInfoContent(isMobileView)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isCurrentUserOwner ? (
              <span
                className="absolute w-full h-full bg-(--color-black-25) rounded-[24px] opacity-0 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
                aria-hidden="true"
              ></span>
            ) : null}
            <DynamicAvatar
              avatarUrl={selectedConversation.image_url}
              avatarBlurHash={selectedConversation.image_object?.file_blur_hash}
              defaultIcon={
                isCurrentUserOwner ? (
                  <ImageOwnerBig className="!w-[80px] !h-[80px]" />
                ) : (
                  <ImageBig className="!w-[80px] !h-[80px]" />
                )
              }
              altText={"Chat Group"}
            />
            <input
              id="inputFile"
              className="hidden"
              ref={inputFilesRef}
              type="file"
              onChange={(e) =>
                sendChangeAvatarRequest(Array.from(e.target.files).at(0))
              }
              accept={globalConstants.allowedAvatarFormats}
              multiple
            />
          </m.div>
          <m.div
            className={`w-full px-[30px] ${
              isCurrentUserOwner ? "cursor-pointer" : ""
            }`}
            onClick={() =>
              isCurrentUserOwner
                ? addSuffix(pathname + hash, "/edit?type=chat")
                : null
            }
            variants={showChatInfoContent(isMobileView)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="text-black text-center text-h4 max-md:text-h5 !font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedConversation.name || (
                <span className="!font-medium text-h4 text-(--color-text-dark)">
                  Group name
                </span>
              )}
            </p>
            <p
              className="text-black text-center mt-[15px] max-h-[50px] text-h6 "
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 2,
              }}
            >
              {selectedConversation.description || (
                <span className="mt-[15px] text-h6 text-(--colot-text-dark)">
                  Description
                </span>
              )}
            </p>
          </m.div>
        </div>
        <div className="py-[30px] px-[20px] flex flex-col flex-1 gap-[15px] rounded-[32px] bg-(--color-accent-light) max-md:pb-[0px] max-md:rounded-t-[16px] max-md:rounded-b-[0px]">
          <m.div
            className="flex justify-between"
            variants={showChatInfoContent(isMobileView)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="text-black !font-medium text-h5">
              {participantsCount} member{participantsCount > 1 ? "s" : ""}
            </p>
            {isCurrentUserOwner ? (
              <AddParticipants
                className="cursor-pointer"
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

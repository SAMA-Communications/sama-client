import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import ParticipantInChat from "@newcomponents/info/elements/ParticipantInChat";
import addSuffix from "@utils/navigation/add_suffix";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@helpers/keyCodes";
import { getConverastionById } from "@store/values/Conversations";
import { getCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import "@newstyles/info/ChatInfo.css";

import { ReactComponent as AddParticipants } from "@newicons/AddParticipants.svg";
import { ReactComponent as Close } from "@newicons/actions/CloseGray.svg";
import { ReactComponent as ImageBig } from "@newicons/media/ImageBig.svg";

export default function ChatInfo() {
  const { pathname, hash } = useLocation();

  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(getCurrentUser);
  const selectedConversation = useSelector(getConverastionById);

  const isCurrentUserOwner = useMemo(() => {
    if (!currentUser || !selectedConversation) {
      return false;
    }
    return currentUser._id === selectedConversation.owner_id?.toString();
  }, [currentUser, selectedConversation]);

  window.onkeydown = function (event) {
    event.keyCode === KEY_CODES.ESCAPE &&
      removeAndNavigateSubLink(pathname + hash, "/info");
    event.keyCode === KEY_CODES.ENTER && event.preventDefault();
  };

  //HOLD FOR RIGHT CLICK CONTEXT MENU
  // const deleteChat = async () => {
  //   const isConfirm = window.confirm(`Do you want to delete this chat?`);
  //   if (isConfirm) {
  //     try {
  //       await api.conversationDelete({ cid: selectedCID });
  //       dispatch(clearSelectedConversation());
  //       dispatch(removeChat(selectedCID));
  //       navigateTo("/");
  //     } catch (error) {
  //       showCustomAlert(error.message, "warning");
  //     }
  //   }
  // };

  const participantsList = useMemo(() => {
    if (!selectedConversation?.participants || !currentUser) {
      return null;
    }

    return selectedConversation.participants.map((uId) => {
      const userObject = participants[uId];
      if (!userObject) {
        return null;
      }

      const isOwner =
        userObject._id === selectedConversation.owner_id?.toString();

      //HOLD FOR RIGHT CLICK CONTEXT MENU
      // const deleteUser = async (event) => {
      //   event.stopPropagation();

      //   if (!window.confirm(`Do you want to delete this user?`)) {
      //     return;
      //   }

      //   const requestData = {
      //     cid: selectedCID,
      //     participants: { remove: [u._id] },
      //   };
      //   await api.conversationUpdate(requestData);
      //remove user form participants field - redux
      // };

      return (
        <ParticipantInChat
          key={uId}
          userObject={userObject}
          isOwner={isOwner}
        />
      );
    });
  }, [selectedConversation, participants, currentUser]);

  const participantsCount = participantsList?.length;

  return (
    <div className="chat-info__container">
      <div className="chat-info__container--top fcc">
        <div className="ci-top__title">Chat info</div>
        <Close
          className="ci-close"
          onClick={() => removeAndNavigateSubLink(pathname + hash, "/info")}
        />
        <div className="ci-photo fcc">
          <ImageBig />
        </div>
        <div
          className={`chat-info__content ${
            isCurrentUserOwner ? "cursor-pointer" : ""
          }`}
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

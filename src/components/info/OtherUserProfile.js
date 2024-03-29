import InfoBox from "@components/info/elements/InfoBox";
import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";
import extractUserIdFromUrl from "@utils/user/extract_user_id_from_url";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page.js";
import { KEY_CODES } from "@helpers/keyCodes";
import { selectParticipantsEntities } from "@store/values/Participants.js";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "@styles/info/UserProfile.css";

import { ReactComponent as Close } from "@icons/actions/CloseGray.svg";
import { ReactComponent as LinkTo } from "@icons/options/LinkTo.svg";
import { ReactComponent as UserIcon } from "@icons/users/ProfileIcon.svg";

export default function OtherUserProfile() {
  const { pathname, hash, search } = useLocation();

  const participants = useSelector(selectParticipantsEntities);

  const userObject = useMemo(
    () => participants[extractUserIdFromUrl(pathname + hash + search)] || {},
    [participants, pathname, hash, search]
  );
  const { _id: userId, login, email, phone } = userObject;

  useEffect(() => {
    const keydownHandler = ({ e }) => {
      e.keyCode === KEY_CODES.ESCAPE &&
        removeAndNavigateLastSection(pathname + hash, "/profile");
      e.keyCode === KEY_CODES.ENTER && e.preventDefault();
    };

    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [hash, pathname]);

  const viewStatusActivity = useMemo(
    () => activityService.getUserLastActivity(userId),
    [userId, participants]
  );

  return (
    <div className="first-window__container">
      <div className="profile__container">
        <div className="profile__container--top fcc">
          <Close
            className="profile__close"
            onClick={() => removeAndNavigateLastSection(pathname + hash)}
          />
          <div className="profile__photo fcc">
            <UserIcon />
          </div>
          <div className="profile__info">
            <p className="uname__full">{getUserFullName(userObject)}</p>
            <p className="profile__status">{viewStatusActivity}</p>
          </div>
        </div>
        <div className="profile__container--bottom">
          <p className="info__title">Personal information</p>
          <InfoBox
            className="uname__box"
            modifier={"--not-hover"}
            iconType={"login"}
            title={"Username"}
            value={login}
            hideIfNull={true}
          />
          <InfoBox
            modifier={"--not-hover"}
            iconType={"phone"}
            title={"Mobile phone"}
            value={phone}
            hideIfNull={true}
          />
          <InfoBox
            modifier={"--not-hover"}
            iconType={"email"}
            title={"Email address"}
            value={email}
            hideIfNull={true}
          />
          <div className="info__link">
            <LinkTo />
            <p
              className="info__new-conversation"
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
      </div>
    </div>
  );
}

import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";
import extractUserIdFromUrl from "@utils/user/extract_user_id_from_url";
import getUserFullName from "@utils/user/get_user_full_name";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page.js";
import { selectParticipantsEntities } from "@store/values/Participants.js";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import "@newstyles/info/UserProfile.css";

import { ReactComponent as Close } from "@newicons/actions/CloseGray.svg";
import { ReactComponent as Email } from "@newicons/media/Email.svg";
import { ReactComponent as Phone } from "@newicons/media/Phone.svg";
import { ReactComponent as User } from "@newicons/users/User.svg";
import { ReactComponent as UserIcon } from "@newicons/users/ProfileIcon.svg";

export default function OtherUserProfile() {
  const { pathname, hash, search } = useLocation();

  const participants = useSelector(selectParticipantsEntities);

  const userObject = useMemo(
    () => participants[extractUserIdFromUrl(pathname + hash + search)] || {},
    [participants, hash, search]
  );
  const { _id: userId, login, email, phone } = userObject;

  window.onkeydown = function (event) {
    event.keyCode === 27 && removeAndNavigateLastSection(pathname + hash);
    event.keyCode === 13 && event.preventDefault();
  };

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
          <div className="info__box uname__box">
            <div>
              <User />
              <p>Username</p>
            </div>
            <p className="info__login">{login}</p>
          </div>
          {phone ? (
            <div className="info__box--not-hover">
              <div>
                <Phone />
                <p>Mobile phone</p>
              </div>
              <p className="info__phone">{phone}</p>
            </div>
          ) : null}
          {email ? (
            <div className="info__box--not-hover">
              <div>
                <Email />
                <p>Email address</p>
              </div>
              <p className="info__email">{email}</p>
            </div>
          ) : null}
          <div className="info__link">
            <p
              className="info__new-conversation"
              onClick={async () =>
                await conversationService.createPrivateChat(userId)
              }
            >
              Start a conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

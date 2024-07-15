import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import InfoBox from "@components/info/elements/InfoBox";
import activityService from "@services/activityService";
import api from "@api/api";
import conversationService from "@services/conversationsService";
import extractUserIdFromUrl from "@utils/user/extract_user_id_from_url";
import getUserFullName from "@utils/user/get_user_full_name";
import UserAvatar from "@components/info/elements/UserAvatar";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page.js";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import {
  addUser,
  selectParticipantsEntities,
} from "@store/values/Participants.js";
import { getIsMobileView } from "@store/values/IsMobileView";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { motion as m } from "framer-motion";
import {
  animateOtherUserContainer,
  animateOtherUserContet,
  animateOtherUserWindow,
} from "@src/animations/animateOtherUser";

import "@styles/info/UserProfile.css";

import { ReactComponent as Close } from "@icons/actions/CloseGray.svg";
import { ReactComponent as LinkTo } from "@icons/options/LinkTo.svg";
import { ReactComponent as BackBtn } from "@icons/options/Back.svg";
import { ReactComponent as UserIcon } from "@icons/users/ProfileIcon.svg";

export default function OtherUserProfile() {
  const dispatch = useDispatch();
  const { pathname, hash, search } = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const participants = useSelector(selectParticipantsEntities);

  const [userObject, setUserObject] = useState({});
  const { _id: userId, login, email, phone } = userObject;

  useEffect(() => {
    if (!hash.includes("/user")) {
      return;
    }

    const uid = extractUserIdFromUrl(pathname + hash + search);
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
  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateLastSection(pathname + hash, "/profile")
  );

  const viewStatusActivity = useMemo(
    () => activityService.getUserLastActivity(userId),
    [userId, participants]
  );

  return (
    <m.div
      className="first-window__container"
      variants={animateOtherUserWindow}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="profile__container">
        <CustomScrollBar>
          <m.div
            className="profile__container--top fcc"
            variants={animateOtherUserContainer(1)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isMobileView ? (
              <BackBtn
                className="ci-close"
                onClick={() => removeAndNavigateLastSection(pathname + hash)}
              />
            ) : (
              <Close
                className="profile__close"
                onClick={() => removeAndNavigateLastSection(pathname + hash)}
              />
            )}
            <m.div
              className="profile__photo fcc"
              variants={animateOtherUserContet}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UserAvatar
                avatarUrl={userObject.avatar_url}
                avatarBlurHash={userObject.avatar_object?.file_blur_hash}
                defaultIcon={<UserIcon />}
              />
            </m.div>
            <m.div
              className="profile__info"
              variants={animateOtherUserContet}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="uname__full">{getUserFullName(userObject)}</p>
              <p className="profile__status">{viewStatusActivity}</p>
            </m.div>
          </m.div>
          <m.div
            className="profile__container--bottom"
            variants={animateOtherUserContainer(2)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <m.p
              className="info__title"
              variants={animateOtherUserContet}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Personal information
            </m.p>
            <InfoBox
              className="uname__box"
              modifier={"--not-hover"}
              iconType={"login"}
              title={"Username"}
              value={login}
              hideIfNull={true}
              isAnimate={true}
            />
            <InfoBox
              modifier={"--not-hover"}
              iconType={"phone"}
              title={"Mobile phone"}
              value={phone}
              hideIfNull={true}
              isAnimate={true}
            />
            <InfoBox
              modifier={"--not-hover"}
              iconType={"email"}
              title={"Email address"}
              value={email}
              hideIfNull={true}
              isAnimate={true}
            />
            <m.div
              className="info__link"
              variants={animateOtherUserContet}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
            </m.div>
          </m.div>
        </CustomScrollBar>
      </div>
    </m.div>
  );
}

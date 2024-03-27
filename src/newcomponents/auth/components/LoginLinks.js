import OvalLoader from "@newcomponents/_helpers/OvalLoader";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import subscribeForNotifications from "@services/notifications";
import usersService from "@services/usersService";
import { KEY_CODES } from "@helpers/keyCodes";
import { setCurrentUser } from "@store/values/CurrentUser";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";

export default function LoginLinks({ changePage, content }) {
  const dispatch = useDispatch();

  const [isLoader, setIsLoader] = useState(false);

  const sendRequest = useCallback(async () => {
    setIsLoader(true);
    try {
      const userData = await usersService.login(content);
      navigateTo("/");
      subscribeForNotifications();
      dispatch(setSelectedConversation({}));
      dispatch(setUserIsLoggedIn(true));
      dispatch(setCurrentUser(userData));
      dispatch(upsertUser(userData));
    } catch (err) {
      localStorage.removeItem("sessionId");
      showCustomAlert(err?.message || err, "danger");
    }
    setIsLoader(false);
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.keyCode === KEY_CODES.ENTER && sendRequest();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sendRequest]);

  return (
    <>
      <div className="auth-form__button fcc" onClick={sendRequest}>
        {isLoader ? (
          <OvalLoader
            height={34}
            width={34}
            mainColor={"var(--color-accent-light)"}
            secondaryColor={"var(--color-white)"}
          />
        ) : (
          <p>Log in</p>
        )}
      </div>
      <div className="authorization__footer">
        New to app?&nbsp;
        <p className="auth-form__link" onClick={changePage}>
          Create an account
        </p>
      </div>
    </>
  );
}

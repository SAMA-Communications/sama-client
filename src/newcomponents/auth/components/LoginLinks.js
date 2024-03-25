import OvalLoader from "@newcomponents/_helpers/OvalLoader";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import subscribeForNotifications from "@services/notifications";
import usersService from "@services/usersService";
import { setCurrentUser } from "@store/values/CurrentUser";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function LoginLinks({ changePage, content }) {
  const dispatch = useDispatch();

  const [isLoader, setIsLoader] = useState(false);

  const sendRequest = async () => {
    setIsLoader(true);
    try {
      const userData = await usersService.login(content);
      if (typeof userData === "string") {
        throw new Error(userData, { message: userData });
      }

      navigateTo("/");
      subscribeForNotifications();
      dispatch(setSelectedConversation({}));
      dispatch(setUserIsLoggedIn(true));
      dispatch(setCurrentUser(userData));
      dispatch(upsertUser(userData));
    } catch (err) {
      localStorage.removeItem("sessionId");
      showCustomAlert(err.message, "danger");
    }
    setIsLoader(false);
  };

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

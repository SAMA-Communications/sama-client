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

export default function SignUpLinks({ changePage, content }) {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoader, setIsLoader] = useState(false);

  const onSubmit = async () => {
    setIsLoader(true);
    try {
      await usersService.create(content);

      if (isLogin) {
        const userData = await usersService.login(content);

        subscribeForNotifications();
        dispatch(setSelectedConversation({}));
        dispatch(setUserIsLoggedIn(true));
        dispatch(upsertUser(userData));
        dispatch(setCurrentUser(userData));
      }

      showCustomAlert(
        `You’ve successfully created a new user${
          isLogin ? " and logged in" : ". You can log in now"
        }.`,
        "success"
      );
      navigateTo(isLogin ? "/" : "/authorization");
    } catch (err) {
      isLogin && localStorage.removeItem("sessionId");
      showCustomAlert(err, "danger");
    }
    setIsLoader(false);
  };

  return (
    <>
      <div className="auth-form__button fcc" onClick={onSubmit}>
        {isLoader ? (
          <OvalLoader
            height={34}
            width={34}
            mainColor={"var(--color-accent-light)"}
            secondaryColor={"var(--color-white)"}
          />
        ) : (
          <p>Create account</p>
        )}
      </div>
      <div className="auth-form__checkbox fcc">
        <input
          type="checkbox"
          id="isLogin"
          checked={isLogin}
          onChange={() => setIsLogin((prev) => !prev)}
        />
        <label htmlFor="isLogin">* also log in as a new user</label>
      </div>
      <div className="authorization__footer">
        Already have an account?&nbsp;
        <p className="auth-form__link" onClick={changePage}>
          Log in
        </p>
      </div>
    </>
  );
}

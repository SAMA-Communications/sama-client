import OvalLoader from "@components/_helpers/OvalLoader";
import encryptionService from "@services/encryptionService";
import garbageCleaningService from "@services/garbageCleaningService";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import subscribeForNotifications from "@services/notifications";
import usersService from "@services/usersService";
import { KEY_CODES } from "@helpers/keyCodes";
import { setCurrentUserId } from "@store/values/CurrentUserId";
import { upsertUser } from "@store/values/Participants";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";

export default function SignUpLinks({ changePage, content }) {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoader, setIsLoader] = useState(false);

  const sendRequest = useCallback(async () => {
    setIsLoader(true);
    try {
      await usersService.create(content);

      if (isLogin) {
        const userData = await usersService.login(content);
        await garbageCleaningService.resetDataOnAuth();
        await encryptionService.registerDevice(userData._id);
        subscribeForNotifications();
        dispatch(upsertUser(userData));
        dispatch(setCurrentUserId(userData._id));
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
      showCustomAlert(err?.message || err, "danger");
    }
    setIsLoader(false);
  }, [content, isLogin]);

  useKeyDown(KEY_CODES.ENTER, sendRequest);

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
        <label htmlFor="isLogin">* Sign in automatically</label>
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

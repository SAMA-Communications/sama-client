import api from "@api/api";
import showCustomAlert from "@utils/show_alert";
import subscribeForNotifications from "@services/notifications";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "@store/values/CurrentUser";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";
import { useDispatch } from "react-redux";
import OvalLoader from "@newcomponents/_helpers/OvalLoader";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { ReactComponent as HidePassword } from "@icons/actions/HidePassword.svg";
import { ReactComponent as ShowPassword } from "@icons/actions/ShowPassword.svg";
import { ReactComponent as Password } from "@icons/auth/Password.svg";
import { ReactComponent as Username } from "@icons/auth/Username.svg";

export default function SignUp({ changePage }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState({});
  const [isLogin, setIsLogin] = useState(true);

  const [passwordType, setPasswordType] = useState("password");
  const [isLoader, setIsLoader] = useState(false);

  const onSubmit = async (data) => {
    setIsLoader(true);
    try {
      [data.ulogin, data.pass] = [
        data.ulogin.trim().toLowerCase(),
        data.pass.trim(),
      ];
      await api.userCreate(data);

      if (isLogin) {
        const { token: userToken, user: userData } = await api.userLogin(data);
        localStorage.setItem("sessionId", userToken);
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
      navigate(isLogin ? "/" : "/authorization");
    } catch (error) {
      isLogin && localStorage.removeItem("sessionId");
      showCustomAlert(error.message, "danger");
    }
    setIsLoader(false);
  };

  return (
    <div className="authorization__form">
      <div className="auth-form__input">
        {/* /[A-Za-z0-9_\-.@]{3,20}/  "The username is a required field." */}
        <input
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
          onChange={({ target }) =>
            setContent((prev) => ({ ...prev, login: target.value }))
          }
          placeholder="Enter your login"
          type={"text"}
          autoComplete="off"
          autoFocus
        />
        <span className="auth-form__placeholder">
          <Username /> Username
        </span>
      </div>
      <div className="auth-form__input">
        {/* min 8  "The username is a required field." */}
        <input
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
          onChange={({ target }) =>
            setContent((prev) => ({ ...prev, password: target.value }))
          }
          placeholder="Enter your password"
          type={passwordType}
          autoComplete="off"
        />
        <div className="auth-form__password-visibility fcc">
          {passwordType === "password" ? (
            <HidePassword onClick={() => setPasswordType("text")} />
          ) : (
            <ShowPassword onClick={() => setPasswordType("password")} />
          )}
        </div>
        <span className="auth-form__placeholder">
          <Password /> Password
        </span>
      </div>
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
    </div>
  );
}

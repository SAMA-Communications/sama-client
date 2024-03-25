import AnimationSamaLogo from "@newcomponents/static/AnimationSamaLogo";
import LoginLinks from "@newcomponents/auth/components/LoginLinks";
import PasswordInput from "@newcomponents/auth/elements/PasswordInput";
import SignUpLinks from "@newcomponents/auth/components/SignUpLinks";
import UserNameInput from "@newcomponents/auth/elements/UserNameInput";
import { useState } from "react";

import "@newstyles/auth/AuthorizationPage.css";

export default function AuthorizationHub() {
  const [page, setPage] = useState("login");
  const [content, setContent] = useState({});

  const isLoginPage = page === "login";

  return (
    <section className="authorization__container">
      <div className={`authorization__side--left-${page}  fcc`}>
        <AnimationSamaLogo />
      </div>
      <div
        className={`authorization__side--main fcc ${
          isLoginPage ? "login-form__mt-49" : ""
        }`}
      >
        <div className="authorization__title fcc">
          <div
            className={!isLoginPage ? "gray" : ""}
            onClick={() => setPage("login")}
          >
            Login
            <div className={`title__bottom-line${isLoginPage ? "" : "gray"}`} />
          </div>
          <div
            className={isLoginPage ? "gray" : ""}
            onClick={() => setPage("signup")}
          >
            SignUp
            <div className={`title__bottom-line${isLoginPage ? "gray" : ""}`} />
          </div>
        </div>
        <div className="authorization__form">
          <UserNameInput setState={setContent} />
          <PasswordInput setState={setContent} />
          {isLoginPage ? (
            <LoginLinks
              changePage={() => setPage("signup")}
              content={content}
            />
          ) : (
            <SignUpLinks
              changePage={() => setPage("login")}
              content={content}
            />
          )}
        </div>
      </div>
      <div className={`authorization__side--right-${page}`} />
    </section>
  );
}

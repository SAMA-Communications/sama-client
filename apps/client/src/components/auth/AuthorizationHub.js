import { useState } from "react";

import "@styles/auth/AuthorizationPage.css";

import AnimationSamaLogo from "@components/static/AnimationSamaLogo";
import LoginLinks from "@components/auth/components/LoginLinks";
import PasswordInput from "@components/auth/elements/PasswordInput";
import SignUpLinks from "@components/auth/components/SignUpLinks";
import UserNameInput from "@components/auth/elements/UserNameInput";

export default function AuthorizationHub({ showDemoMessage = false }) {
  const [page, setPage] = useState("login");
  const [content, setContent] = useState({});

  const isLoginPage = page === "login";

  return (
    <section className="authorization__container">
      <div
        className={`authorization__side--left-${page}  flex items-center justify-center`}
      >
        <AnimationSamaLogo />
      </div>
      <div
        className={`authorization__side--main flex items-center justify-center ${
          isLoginPage ? "login-form__mt-49" : "signup-form__mt-20"
        }`}
      >
        {showDemoMessage ? (
          <div className="authorization__demo-message">
            <p>Welcome to the SAMA demo.</p>
            <p>
              You can connect using the following credentials:
              <br></br>
              <b>sama-user-1</b> or <b>sama-user-2</b>
              <br></br>
              and <b>demo-password</b>
            </p>
          </div>
        ) : null}
        <div className="authorization__title flex items-center justify-center">
          <div
            className={!isLoginPage ? "gray" : ""}
            onClick={() => setPage("login")}
          >
            Login
            <div
              className={`title__bottom-line${isLoginPage ? "" : "--none"}`}
            />
          </div>
          <div
            className={isLoginPage ? "gray" : ""}
            onClick={() => setPage("signup")}
          >
            SignUp
            <div
              className={`title__bottom-line${isLoginPage ? "--none" : ""}`}
            />
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

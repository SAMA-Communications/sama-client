import Login from "@newcomponents/auth/components/Login";
import SignUp from "@newcomponents/auth/components/SignUp";
import AnimationSamaLogo from "@newcomponents/static/AnimationSamaLogo";

import "@newstyles/auth/AuthorizationPage.css";
import { useState } from "react";

export default function AuthorizationHub() {
  const [page, setPage] = useState("login");

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
        {isLoginPage ? (
          <Login changePage={() => setPage("signup")} />
        ) : (
          <SignUp changePage={() => setPage("login")} />
        )}
      </div>
      <div className={`authorization__side--right-${page}`}></div>
    </section>
  );
}

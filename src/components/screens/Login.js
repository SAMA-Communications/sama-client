import React, { useState } from "react";
import api from "../../api/api";
import MainLogo from "../static/MainLogo";
import urlBase64ToUint8Array from "../../api/base64_to_uint8Array.js";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import {
  changeOpacity,
  loginBox,
} from "../../styles/animations/animationBlocks";
import { setChats } from "../../store/Conversations";
import { setSelectedConversation } from "../../store/SelectedConversation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { motion as m } from "framer-motion";

import "../../styles/AuthForm.css";

import { ReactComponent as HidePassword } from "./../../assets/icons/authForm/HidePassword.svg";
import { ReactComponent as ShowPassword } from "./../../assets/icons/authForm/ShowPassword.svg";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [passwordType, setPasswordType] = useState("password");
  const [loader, setLoader] = useState(false);
  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const userToken = await api.userLogin(data);
      localStorage.setItem("sessionId", userToken);
      navigate("/main");
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) =>
            reg.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  process.env.REACT_APP_PUBLIC_VAPID_KEY
                ),
              })
              .then((sub) =>
                //TODO: optimize ?btoa?
                api.pushSubscriptionCreate({
                  web_endpoint: sub.endpoint,
                  web_key_auth: btoa(
                    String.fromCharCode(...new Uint8Array(sub.getKey("auth")))
                  ),
                  web_key_p256dh: btoa(
                    String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")))
                  ),
                })
              )
          )
          .catch((err) => console.log(err));
      }
      dispatch(setSelectedConversation({}));
      dispatch(setChats([]));
    } catch (error) {
      localStorage.clear();
      alert(error.message);
    }
    setLoader(false);
  };
  const renderErrorMessage = (err) => <div className="error">{err}</div>;

  const renderForm = (
    <div className="login-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <input
            {...register("ulogin", {
              required: "* Username is required field",
              // pattern: /^[a-z0-9._%+-]$/,
            })}
            placeholder=" "
            type={"text"}
            autoComplete="off"
            autoFocus
          />
          <span className="input-placeholder">Username</span>
          <span className="input-border-focus"></span>
          {errors.ulogin?.message && renderErrorMessage(errors.ulogin.message)}
        </div>
        <div className="input-container">
          <input
            {...register("pass", {
              required: "* Password is required field",
              // minLength: 8,
            })}
            placeholder=" "
            type={passwordType}
            autoComplete="off"
          />
          <span className="password-visibility">
            {passwordType === "password" ? (
              <HidePassword onClick={() => setPasswordType("text")} />
            ) : (
              <ShowPassword onClick={() => setPasswordType("password")} />
            )}
          </span>
          <span className="input-placeholder">Password</span>
          <span className="input-border-focus"></span>
          {errors.pass?.message && renderErrorMessage(errors.pass.message)}
        </div>
        <input type="submit" value="Log in" />
        <div className="button-container">
          New to app?&nbsp;
          <Link to={`/signup`} className="btn-signup">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <m.div
        variants={loginBox}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="login-box"
      >
        <div className="login-box-left bg-login">
          <MainLogo />
        </div>
        <m.div
          variants={changeOpacity(0.72, 0.7, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="login-box-right"
        >
          <p className="login-form-title">user login</p>
          <p className="login-form-text">Welcome</p>
          <hr className="login-form-dash" />
          <Oval
            height={40}
            width={40}
            color="#1a8ee1"
            wrapperStyle={{ right: "10%", top: "9.2%" }}
            wrapperClass="loader"
            visible={loader}
            ariaLabel="oval-loading"
            secondaryColor="#8dc7f0"
            strokeWidth={2}
            strokeWidthSecondary={3}
          />
          {renderForm}
        </m.div>
      </m.div>
    </div>
  );
}

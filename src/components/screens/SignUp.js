import React, { useState } from "react";
import api from "../../api/api";
import MainLogo from "../static/MainLogo";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import {
  changeOpacity,
  loginBox,
} from "../../styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

import "../../styles/AuthForm.css";

import { ReactComponent as HidePassword } from "./../../assets/icons/authForm/HidePassword.svg";
import { ReactComponent as ShowPassword } from "./../../assets/icons/authForm/ShowPassword.svg";

export default function SignUp() {
  const navigate = useNavigate();
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
      api.connect().then(async () => {
        await api.userCreate(data);
        alert("You have successfully create a new user. Now you can login.");
        navigate("/login");
      });
    } catch (error) {
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
          <span className="input-placeholder">Username *</span>
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
          <span className="input-placeholder">Password *</span>
          <span className="input-border-focus"></span>
          {errors.pass?.message && renderErrorMessage(errors.pass.message)}
        </div>
        <input type="submit" value="Create account" />
        <div className="button-container">
          Already have an account?&nbsp;
          <Link to={`/login`} className="btn-signup">
            Log in
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
        className="login-box login-box-create"
      >
        <div className="login-box-left bg-create">
          <MainLogo />
        </div>
        <m.div
          variants={changeOpacity(0.72, 0.7, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="login-box-right"
        >
          <p className="login-form-title">user create</p>
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

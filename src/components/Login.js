import React, { useState } from "react";
import api from "../api/api";
import { useForm } from "react-hook-form";
import { Triangle } from "react-loader-spinner";

import "../styles/AuthForm.css";

export default function Login({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loader, setLoader] = useState(false);

  const onSubmit = async (data) => {
    setLoader(true);
    const response = await api.userLogin(data);
    if (!response.status) {
      onSuccess(true);
    } else {
      alert(response.message);
    }
    setLoader(false);
  };
  const renderErrorMessage = (err) => <div className="error">{err}</div>;

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <label>Login</label>
          <input
            {...register("ulogin", {
              required: "* Login is require field",
              // pattern: /^[a-z0-9._%+-]$/,
            })}
            placeholder="Enter login"
            autoComplete="off"
          />
          {errors.ulogin?.message && renderErrorMessage(errors.ulogin.message)}
        </div>
        <div className="input-container">
          <label>Password</label>
          <input
            {...register("pass", {
              required: "* Password is require field",
              // minLength: 8,
            })}
            placeholder="Enter password"
            autoComplete="off"
          />
          {errors.pass?.message && renderErrorMessage(errors.pass.message)}
        </div>
        <div className="button-container">
          <input type="submit" value="Log in" />
        </div>
        <div className="button-container-text">
          New to app?&nbsp;
          <a className="signup" onClick={() => onSuccess("register")}>
            Create an account
          </a>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">
          Log in
          <Triangle
            height="50"
            width="50"
            color="#1a8ee1"
            wrapperStyle={{ right: "21%" }}
            wrapperClass="loader"
            ariaLabel="triangle-loading"
            visible={loader}
          />
        </div>
        {renderForm}
      </div>
    </div>
  );
}

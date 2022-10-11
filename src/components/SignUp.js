import React, { useState } from "react";
import api from "../api/api";
import { useForm } from "react-hook-form";
import { Triangle } from "react-loader-spinner";

import "../styles/AuthForm.css";

export default function SignUp({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loader, setLoader] = useState(false);

  const onSubmit = async (data) => {
    setLoader(true);
    const response = await api.userCreate(data);
    if (!response.status) {
      alert("You have successfully create a new user. Now you can login.");
      onSuccess("login");
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
          <label>Login *</label>
          <input
            {...register("ulogin", {
              required: "* Login is require field",
              // pattern: /^[a-z0-9._%+-]/,
            })}
            placeholder="Enter login"
            autoComplete="off"
          />
          {errors.ulogin?.message && renderErrorMessage(errors.ulogin.message)}
        </div>
        <div className="input-container">
          <label>Password *</label>
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
          <input type="submit" value="Create account" />
        </div>
        <div className="button-container-text">
          Already have an account?&nbsp;
          <a className="signup" onClick={() => onSuccess("login")}>
            Log in
          </a>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">
          Create an account
          <Triangle
            height="50"
            width="50"
            color="#1a8ee1"
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

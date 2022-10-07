import React from "react";
import api from "../api/api";
import { useForm } from "react-hook-form";

import "../styles/AuthForm.css";

export default function Login({ onSignUp }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const user = await api.login(data);
    onSignUp(true);
  };
  const renderErrorMessage = (err) => <div className="error">{err}</div>;

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <label>Email ID</label>
          <input
            {...register("uname", {
              required: "* Email ID is require field",
              // pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
            })}
            placeholder="Enter email address"
            autoComplete="off"
          />
          {errors.uname?.message && renderErrorMessage(errors.uname.message)}
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
          <a className="signup" onClick={() => onSignUp("register")}>
            Create an account
          </a>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">Log in</div>
        {renderForm}
      </div>
    </div>
  );
}

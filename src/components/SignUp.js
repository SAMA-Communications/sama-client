import React from "react";
import api from "../api/api";
import { useForm } from "react-hook-form";

import "../styles/AuthForm.css";

export default function SignUp({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await api.userCreate(data);
    if (!response.status) {
      onLogin("login");
    } else {
      window.alert = () => {
        <p className="alert-form">${response.message}</p>;
      };
    }
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
          <a className="signup" onClick={() => onLogin("login")}>
            Log in
          </a>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">Create an account</div>
        {renderForm}
      </div>
    </div>
  );
}

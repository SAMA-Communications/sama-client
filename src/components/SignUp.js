import React, { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { useForm } from "react-hook-form";

import "../styles/AuthForm.css";

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loader, setLoader] = useState(false);

  const onSubmit = async (data) => {
    setLoader(true);
    try {
      await api.userCreate(data);
      alert("You have successfully create a new user. Now you can login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
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
          <Link to={`/login`} className="signup">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">
          Create an account
          <Oval
            height={40}
            width={40}
            color="#1a8ee1"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={loader}
            ariaLabel="oval-loading"
            secondaryColor="#8dc7f0"
            strokeWidth={2}
            strokeWidthSecondary={3}
          />
        </div>
        {renderForm}
      </div>
    </div>
  );
}

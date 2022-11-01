import React, { useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { setSelectedConversation } from "../../store/SelectedConversation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import "../../styles/AuthForm.css";
import { setChats } from "../../store/Conversations";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loader, setLoader] = useState(false);
  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const userToken = await api.userLogin(data);
      localStorage.setItem("sessionId", userToken);
      navigate("/main");
      dispatch(setSelectedConversation({}));
      dispatch(setChats([]));
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
          <Link to={`/signup`} className="signup">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="title">
          Log in
          <Oval
            height={40}
            width={40}
            color="#1a8ee1"
            wrapperStyle={{ right: "23%" }}
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

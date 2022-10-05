import React from "react";

import "../styles/Login.css";

export default function Login({ onSubmit, onSignUp, error }) {
  const handleSubmit = (event) => {
    // Prevent page reload
    event.preventDefault();

    onSubmit();
  };

  // Generate JSX code for error message
  const renderErrorMessage = () => <div className="error">{error}</div>;

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email ID </label>
          <input
            type="email"
            name="uname"
            placeholder="Enter email address"
            required
          />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input
            type="password"
            name="pass"
            placeholder="Enter password"
            required
          />
          {error && renderErrorMessage()}
        </div>
        <div className="button-container">
          <input type="submit" value="Log in" />
        </div>
        <div className="button-container-text">
          New to app?&nbsp;
          <a className="signup" onClick={onSignUp}>
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

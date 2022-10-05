import React from "react";

import "../styles/SignUp.css";

export default function SignUp({ onSubmit, onLogin, error }) {
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
          <label>Email ID *</label>
          <input
            type="email"
            name="uname"
            placeholder="Enter email address"
            required
          />
        </div>
        <div className="input-container">
          <label>Password *</label>
          <input
            type="password"
            name="pass"
            placeholder="Enter password"
            required
          />
          {error && renderErrorMessage()}
        </div>
        <div className="button-container">
          <input type="submit" value="Create account" id="submit" />
        </div>
        <div className="button-container-text">
          Already have an account?&nbsp;
          <a className="signup" onClick={onLogin}>
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

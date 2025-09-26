import React from "react";

function LoginForm() {
  return (
    <div id="login-form-container">
      <form id="login-form" action="/login" method="POST">
        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Username" />
        <label htmlFor="password">Password</label>
        <input id="password" type="text" placeholder="Password" />
        <a id="forgot-password" href="#">Forgot password?</a>
        <input id="login-button" type="submit" value="LOGIN" />
      </form>
    </div>
  );
}

export default LoginForm;

import React, { useState } from "react";
import { FaEye } from 'react-icons/fa';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleInput(event) {
    const inputType = event.target.id;
    const newInputValue = event.target.value;
    //check if input is from username or password.
    if (inputType === "username") {
      setUsername(newInputValue);
    } else {
      setPassword(newInputValue);
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      //checks if server response is ok (200-299).
      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data);

        //reset username and password states.
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div id="login-form-container">
      <form onSubmit={handleFormSubmit} id="login-form">
        <label htmlFor="username">Username</label>
        <input
          onChange={handleInput}
          id="username"
          type="text"
          placeholder="Username"
          value={username}
        />
        <label htmlFor="password">Password</label>
        <div id="password-container">
          <input
            onChange={handleInput}
            id="password"
            type="password"
            placeholder="Password"
            value={password}
          />
          <span id="show-password-icon">
            <FaEye />
          </span>
        </div>
        <a id="forgot-password" href="#" tabIndex={0}>
          Forgot password?
        </a>
        <input id="login-button" type="submit" value="LOGIN" tabIndex={0} />
      </form>
    </div>
  );
}

export default LoginForm;

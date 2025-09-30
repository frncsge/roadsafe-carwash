import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successLogin, setSuccessLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
      const data = await response.json();

      //checks if server response is ok (200-299).
      if (response.ok) {
        console.log("Server response:", data);
        //reset username and password states.
        setUsername("");
        setPassword("");
      }
      setSuccessLogin(data.success);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div id="login-form-container">
      <img id="login-logo" src="/roadsafe logo.png" alt="Roadsafe Logo" />
      <form onSubmit={handleFormSubmit} id="login-form">
        {!successLogin ? (
          <span id="login-message">*Invalid username or password!</span>
        ) : null}
        <label htmlFor="username">Username</label>
        <input
          onChange={handleInput}
          id="username"
          type="text"
          placeholder="Username"
          required
          value={username}
        />
        <label htmlFor="password">Password</label>
        <div id="password-container">
          <input
            onChange={handleInput}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            id="show-password-icon"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
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

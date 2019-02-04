import React from 'react'

const LoginForm = ({
  handleSubmit, handleUserChange, handlePassChange, handleLoginButton,
    handleRegisterButton, username, password, mode
  }) =>
  <div>
    <h2>Login Screen (Mockup)</h2>
    <button
      type="button"
      className={mode ? "mode-selector-active" : "mode-selector-inactive"}
      onClick={handleLoginButton}>
      Login
    </button>
    <button
      type="button"
      className={mode ? "mode-selector-inactive" : "mode-selector-active"}
      onClick={handleRegisterButton}>
      Register
    </button>
    <br/>
    <form
      className="login-form"
      onSubmit={handleSubmit}>
      <label htmlFor="uname" className="login">Username:</label>
      <input
        id="uname"
        className="login-form"
        value={username}
        onChange={handleUserChange}
      />
      <br/>
      <label htmlFor="pword" className="login">Password:</label>
      <input
        id="pword"
        className="login-form"
        value={"*".repeat(password.length)}
        onChange={handlePassChange}
      />
      <br/>
      <button
        className="login-confirm"
        type="submit">
        {mode ? "Login" : "Register"}
      </button>
    </form>
  </div>

export default LoginForm

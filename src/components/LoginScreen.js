import React from 'react';
import LoginForm from './subcomponents/LoginForm';

class LoginScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      currUsername: "",
      currPassword: "",
      loginMode: true
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted");

    this.setState({
      currUsername: "",
      currPassword: ""
    });
  }

  handleUserChange = (event) =>
    this.setState({
      currUsername: event.target.value
    });

  handlePassChange = (event) =>
    this.setState({
      currPassword: event.target.value
    });

  handleRegisterButton = (event) =>
    this.setState({
      loginMode: false
    });

  handleLoginButton = (event) =>
    this.setState({
      loginMode: true
    });

  render() {
    return(
      <div className="login-screen">
        <LoginForm
          username={this.state.currUsername}
          password={this.state.currPassword}
          handleSubmit={this.handleSubmit}
          handleUserChange={this.handleUserChange}
          handlePassChange={this.handlePassChange}
          handleLoginButton={this.handleLoginButton}
          handleRegisterButton={this.handleRegisterButton}
          mode={this.state.loginMode}
        />
      </div>
    )
  }
}

export default LoginScreen;

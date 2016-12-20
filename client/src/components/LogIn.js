import React from 'react';
import { Link } from 'react-router';

export default class LogIn extends React.Component {
  static PropTypes = {

  }

  handleEmailSignin = (e) => {
    e.preventDefault();
    const creds = {
      email: this.emailInput.value,
      password: this.passwordInput.value,
    };
    this.props.logInUser(creds);
  }

  render() {
    const errorMsg = this.props.auth.errorMessage;
    return (
      <div className="login">
        <button className="google-login" onClick={this.props.logInUserGoogle}>
          Log in with Google
        </button>
        <form className="login-form" onSubmit={this.handleEmailSignin}>
          <input
            placeholder="you@domain.com"
            name="email"
            type="email"
            ref={(ref) => { this.emailInput = ref; }}
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            ref={(ref) => { this.passwordInput = ref; }}
          />
          <button>{this.props.auth.isFetching ? 'Logging in...' : 'Log In!'}</button>
          <Link to={'/signup'}>Sign Up!</Link>
        </form>
        <span style={{ display: !errorMsg || errorMsg.length === 0 ? 'none' : 'block' }}>{errorMsg}</span>
      </div>
    );
  }
}

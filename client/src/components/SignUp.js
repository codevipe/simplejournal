import React from 'react';
import { Link } from 'react-router';

export default class SignUp extends React.Component {
  static PropTypes = {

  }

  handleEmailSignup = (e) => {
    e.preventDefault();
    const user = {
      email: this.emailInput.value,
      password: this.passwordInput.value,
    };
    this.props.signUpUser(user);
  }

  render() {
    return (
      <div className="signup">
        <button className="google-signup" onClick={this.props.logInUserGoogle}>
          Sign up with Google
        </button>
        <form className="email-signup" onSubmit={this.handleEmailSignup}>
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
          <button>
            {this.props.auth.isFetching ? 'Signing up...' : 'Sign up!'}
          </button>
          <Link to={'/login'}>Already have an account? Log in!</Link>
        </form>
      </div>
    );
  }
}

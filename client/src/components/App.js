import React, { Component } from 'react';
import { push } from 'react-router-redux';

import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';

export default class App extends Component {
  componentWillMount() {
    this.checkAuth(this.props.auth.isAuthenticated);
    if (this.props.location.hash) {
      this.props.handleLoginHash(this.props.location.hash);
    }
  }

  checkAuth = (isAuthenticated) => {
    if (!isAuthenticated) {
      this.props.router.push('/login');
    }
  }

  render() {
    if (!this.props.auth.isAuthenticated && this.props.location.pathname === '/signup') {
      return <SignUp {...this.props} />;
    } else if (!this.props.auth.isAuthenticated) {
      return <LogIn {...this.props} />;
    }
    return <Home {...this.props} />;
  }
}

import React, { Component } from 'react';

import LoadingBar from 'react-redux-loading-bar';
import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';

export default class App extends Component {
  componentWillMount() {
    this.checkAuth(this.props.auth.isAuthenticated);
    if (this.props.location.hash) {
      this.props.handleLoginHash(this.props.location.hash);
    }
    if (this.props.auth.user) {
      this.props.getJournalEntry(this.props.auth.user);
    }
  }

  checkAuth = (isAuthenticated) => {
    if (!isAuthenticated) {
      this.props.router.push('/login');
    }
  }

  handleLogoutClick(e) {
    e.preventDefault();
    this.props.logOutUser();
  }

  render() {
    const locPath = this.props.location.pathname;
    const { isAuthenticated, user, isFetching } = this.props.auth;
    let component;
    if (!isAuthenticated && locPath === '/signup') {
      component = <SignUp {...this.props} />;
    } else if (!isAuthenticated) {
      component = <LogIn {...this.props} />;
    } else {
      component = <Home {...this.props} />;
    }

    return (
      <div>
        <header>
          <LoadingBar
            style={{ backgroundColor: '#5FBFF9', height: '3px' }}
            maxProgress={98}
            updateTime={100}
            progressIncrease={10}
          />
          <h2 className="header-brand">SimpleJournal</h2>
          {isAuthenticated &&
            <div className="header-user">
              <span>{user ? `Hi, ${user.nickname}` : 'loading...'}</span>
              <button onClick={e => this.handleLogoutClick(e)}>
                {isFetching ? (
                  <div>Logging out...</div>
                ) : (
                  <span>Log out</span>
                )}
              </button>
            </div>
          }
        </header>
        <div className="content">
          {component}
        </div>
      </div>
    );
  }
}

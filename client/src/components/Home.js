import React from 'react';

export default class Home extends React.Component {
  static PropTypes = {

  }

  handleClick(e) {
    e.preventDefault();
    this.props.logOutUser();
  }


  render() {
    const { user, isFetching } = this.props.auth;
    return (
      <div>
        <h1>WELCOME HOME!</h1>
        <span>{user ? `Hi, ${user.nickname}` : 'loading...'}</span>
        <button onClick={e => this.handleClick(e)}>
          {isFetching ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    );
  }

}

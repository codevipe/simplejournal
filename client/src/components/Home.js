import React from 'react';

import JournalEntry from './JournalEntry';

export default class Home extends React.Component {
  static PropTypes = {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.journal.errorMessage === 'Internal Server Error') {
      location.reload();
    }
  }

  render() {
    const { user, isFetching } = this.props.auth;
    return (
      <div>
        {this.props.journal.isFetching &&
          <div>
            <div className="ui active inline loader" />
          </div>
        }
        {this.props.journal.isWriting &&
          <JournalEntry {...this.props} />
        }
        {this.props.journal.errorMessage &&
          <p>{this.props.journal.errorMessage}</p>
        }
      </div>
    );
  }

}

import React from 'react';
import { throttle } from 'lodash';

import QuestionButton from './QuestionButton';

export default class JournalEntry extends React.Component {
  static PropTypes = {

  }

  componentWillMount() {
    this.throttleSave = throttle((e) => {
      this.props.saveJournalEntry(this.props.auth.user.user_id,
        { ...this.props.journal.entry,
          morningPages: this.morningPages.value,
        },
      );
    }, 1500);
  }

  componentDidMount() {
    if (this.props.journal.entry.morningPages && this.morningPages) {
      this.morningPages.value = this.props.journal.entry.morningPages;
    }
  }

  gratefulOptions = [
    { id: 'relationship', val: 'A relationship that means a lot to you or has even just helped you.' },
    { id: 'opportunity', val: 'An opportunity, big or small, that you have today.' },
    { id: 'experienced', val: 'Something amazing that you experienced or witnessed yesterday.' },
    { id: 'simple', val: 'Something simple that you can actually see right now (anything!).' },
    { id: 'else', val: 'Something else.' },
  ]

  handleStuckClick = (e) => {
    const { user_id } = this.props.auth.user;
    const { entry } = this.props.journal;
    const isStuck = e.target.innerHTML.includes('Yes');
    this.props.stuckSelectedAndSaved(user_id, entry, isStuck);
  }

  handleStuckTextEntry = (e) => {
    e.persist();
    // this is here to hack display of saving text so it's not super fast
    this.props.savingJournalEntry();
    this.throttleSave(e);

    if (this.morningPages.value.split(' ').length >= 600) {
      alert('FUCK YOU DID IT!!!');
    }
  }

  handleGratefulSubmit = (e) => {
    e.preventDefault();
    const { user_id } = this.props.auth.user;
    const { entry } = this.props.journal;
    const gratefulObj = {
      id: e.target.dataset.id, text: this.gratefulText.value,
    };
    let gratefulArr;
    entry.grateful ? gratefulArr = [...entry.grateful, gratefulObj] : gratefulArr = [gratefulObj];
    console.log(gratefulArr);
    this.props.gratefulEnteredAndSaved(user_id, entry, gratefulArr);
  }

  handleHypeSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const journal = this.props.journal;

    return (
      <div className="journal-entry">
        <span>{journal.isFetching ? 'Loading...' : ''}</span>
        {typeof journal.entry.isStuck === 'undefined' &&
          <div>
            <h2>Are you feeling stuck?</h2>
            <button onClick={this.handleStuckClick}>Yes</button>
            <button onClick={this.handleStuckClick}>No</button>
          </div>
        }
        {journal.entry.isStuck &&
          <div>
            <textarea
              className="morning-pages"
              ref={(ref) => { this.morningPages = ref; }}
              onKeyUp={this.handleStuckTextEntry}
            />
          </div>
        }
        {journal.entry.isStuck === false && (!journal.entry.grateful || journal.entry.grateful.length < 3) &&
          <div>
            <h3>What are you grateful for?</h3>
            {this.gratefulOptions.map((option) => { // eslint-disable-line
              const entering = journal.enteringGrateful;
              if (!entering) {
                return (<QuestionButton
                  id={`${option.id}`}
                  key={`${option.id}`}
                  option={option}
                  handleClick={this.props.gratefulSelected}
                />);
              } else if (entering === option.id) {
                return (
                  <form data-id={`${option.id}`} onSubmit={this.handleGratefulSubmit}>
                    <h4 className="selected-question">{option.val}</h4>
                    <input
                      type="text" className="grateful-text"
                      ref={(ref) => { this.gratefulText = ref; }}
                    />
                    <button type="submit">Done!</button>
                  </form>
                );
              }
            })}
          </div>
        }
        {journal.entry.grateful && journal.entry.grateful.length >= 3 &&
          <div>
            <h3>What about today is going to be AWESOME!?</h3>
            <form onSubmit={this.handleHypeSubmit}>
              <input type="text" className="hype-text" />
              <button type="submit">Done!</button>
            </form>
          </div>
        }
        <span>{journal.isSaving ? 'Saving...' : ''}</span>
      </div>
    );
  }
}

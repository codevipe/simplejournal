import React from 'react';

const QuestionButton = props => (
  <div>
    <button
      className="question-button"
      onClick={() => props.handleClick(props.option.id)}
    >{props.option.val}</button>
  </div>
);

export default QuestionButton;

import React, { Component } from "react";

export class QuizName extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.props.onChange;
  }

  render() {
    const { quizName } = this.props;

    return (
      <input
        defaultValue={quizName}
        maxLength="70"
        autoComplete="off"
        onChange={this.onChange}
        type="text"
        name="quiz_Name"
        tabIndex="2"
      ></input>
    );
  }
}

export default QuizName;

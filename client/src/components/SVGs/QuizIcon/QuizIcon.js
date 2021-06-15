import React, { Component } from "react";
import "./QuizIcon.css";

export class QuizIcon extends Component {
  render() {
    return (
      <svg
        className="navbarIcon quizIconSVG"
        x="0px"
        y="0px"
        viewBox="0 0 450 585"
        style={{ "enableBackground": "new 0 0 450 585" }}
        xmlSpace="preserve"
      >
        <path
          className="quizIconPath0"
          d="M390.8,567H59.2C36.45,567,18,548.55,18,525.8V59.2C18,36.45,36.45,18,59.2,18h331.6
            c22.76,0,41.2,18.45,41.2,41.2v466.6C432,548.55,413.55,567,390.8,567z"
        />
        <rect x="234" y="99" className="quizIconPath1" width="135" height="0.01" />
        <rect x="234" y="278.99" className="quizIconPath1" width="135" height="0.01" />
        <rect x="81" y="236.25" className="quizIconPath2" width="117" height="87.75" />
        <polyline className="quizIconPath3" points="117,248.14 147,306 207,171 " />
        <rect x="81" y="63" className="quizIconPath2" width="117" height="87.75" />
        <rect x="234" y="459" className="quizIconPath1" width="135" height="0.01" />
        <rect x="81" y="423" className="quizIconPath2" width="117" height="87.75" />
      </svg>
    );
  }
}

export default QuizIcon;

import React, { Component } from "react";
import KaTeX_Item from "./KaTeX_Item";
import classnames from "classnames";
import { v4 as generateUniqueID } from "uuid";

export class AnswerItem extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.answerOnChange = this.props.answerOnChange;
    this.setCorrectAnswer = this.props.setCorrectAnswer;
    this.deleteAnswer = this.props.deleteAnswer;
    this.setPreviewText = this.setPreviewText.bind(this);
    this.AnswerInput = React.createRef();
  }

  render() {
    const { questionIndex, answerIndex, potentialAnswer, disableInput } = this.props;

    try {
      var previewText;
      if (
        this.AnswerInput &&
        this.AnswerInput.current &&
        this.AnswerInput.current.value &&
        this.AnswerInput.current.value.match(/(\[math\].*?\[\/math\])/)
      ) {
        // previewText = this.setPreviewText(this.AnswerInput.current.innerHTML);
        // console.log("preview if answer: ", this.AnswerInput.current.value);
        previewText = this.setPreviewText(this.AnswerInput.current.value);
      } else if (potentialAnswer.potentialAnswer && potentialAnswer.potentialAnswer.match(/(\[math\].*?\[\/math\])/)) {
        // console.log("preview else answer: ", potentialAnswer.potentialAnswer);
        previewText = this.setPreviewText(potentialAnswer.potentialAnswer);
      }
      // console.log(`katex div has been set from render ${this.AnswerInput.current.value}`);
    } catch (err) {
      // console.log("previewText error: ", err);
    }

    // const previewText = this.setPreviewText(potentialAnswer.potentialAnswer);

    return (
      <li className="createQuizPotentialAnswerLI">
        <div className="createQuizPotentialAnswerElementDiv">
          <div className="createQuizCorrectAnswerRadioDiv">
            <input
              className="createQuizCorrectAnswerRadio"
              checked={potentialAnswer.correctAnswer === true}
              type="radio"
              name={"q" + questionIndex}
              id={"q" + questionIndex + "a" + answerIndex}
              onChange={function () {
                this.setCorrectAnswer(questionIndex, answerIndex);
              }.bind(this)}
            />
            <label className="createQuizCorrectAnswerRadioLabel" htmlFor={"q" + questionIndex + "a" + answerIndex}>
              &#10004;
            </label>
          </div>

          <div className="previewAndInputDiv">
            {potentialAnswer.potentialAnswer.match(/(\[math\].*?\[\/math\])/) ? (
              <div className="previewTextAnswerDiv">
                <p className="previewQuestionParagraph">Answer {String.fromCharCode(65 + answerIndex)} preview:</p>

                <span className="katex">{previewText}</span>
              </div>
            ) : null}

            <div className="inputAnswerTextAndDelete">
              <input
                disabled={disableInput}
                ref={this.AnswerInput}
                className={classnames("inputAnswerText", {
                  "inputAnswerTextLimit": potentialAnswer.potentialAnswer.length >= 500,
                })}
                type="text"
                name="answerText"
                onChange={function (e) {
                  this.answerOnChange(e, questionIndex, answerIndex);
                }.bind(this)}
                placeholder="Answer text here"
                value={potentialAnswer.potentialAnswer}
                autoComplete="off"
                maxLength={500}
              />
              {answerIndex > 1 ? (
                <div
                  onClick={function () {
                    this.deleteAnswer(questionIndex, answerIndex);
                  }.bind(this)}
                  className="createQuizDeleteAnswer"
                >
                  +
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </li>
    );
  }

  setPreviewText(someText) {
    if (someText === null) return;

    var componentsReg = /(\[math\].*?\[\/math\])/gu;

    var splitComponents = someText.split("\n");
    splitComponents = splitComponents.map(function (item, index) {
      if (index !== splitComponents.length - 1) return item + " ...LBRK... ";
      else return item;
    });

    var lineBreakSplitKeepDelimiter = splitComponents.join("");

    splitComponents = lineBreakSplitKeepDelimiter;
    splitComponents = splitComponents.split(componentsReg);

    var reg = /\[math\](.*?)\[\/math\]/gu;

    splitComponents = splitComponents.filter(function (item) {
      return item !== "";
    });
    splitComponents = splitComponents.map(function (item, index) {
      if (!item.match(reg)) {
        return item.split(" ");
      } else return item;
    });

    var newSplitComponents = [],
      katexIDs = [];

    for (var i = 0; i < splitComponents.length; i++) {
      if (typeof splitComponents[i] === "object") {
        var splitKeepDelimiter = splitComponents[i].map(function (item) {
          return item + " ";
        });
        newSplitComponents.push.apply(newSplitComponents, splitKeepDelimiter);
      } else {
        newSplitComponents.push(splitComponents[i]);
      }
      katexIDs.push(generateUniqueID());
    }
    return (
      <div className="returnKatexDiv">
        {" "}
        {newSplitComponents.map(
          function (part, i) {
            if (newSplitComponents[i].match(reg) !== null) {
              return <KaTeX_Item key={katexIDs[i]} katexText={newSplitComponents[i]} newTimeout={this.props.newTimeoutAnswer} />;
            } else if (part === "...LBRK... ") {
              return <div key={katexIDs[i]} className="dummyFiller"></div>;
            } else {
              return (
                <p key={katexIDs[i]} className="nonKatexSpan">
                  {newSplitComponents[i].toString()}
                </p>
              );
            }
          }.bind(this)
        )}{" "}
      </div>
    );
  }
}

export default AnswerItem;

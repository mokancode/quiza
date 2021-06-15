import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";
import classnames from "classnames";
import KaTeX_Item from "./KaTeX_Item";
import TakeQuiz_Answer_Item from "./TakeQuiz_Answer_Item";
import { v4 as generateUniqueID } from "uuid";

export class TakeQuiz_Question_Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSizeMaxed: false,
    };

    this.setAnswer = this.props.setAnswer;

    // refs
    this.katexDiv = React.createRef();
  }

  componentDidMount() {
    const { question } = this.props;

    if (question.question.match(/(\[math\].*?\[\/math\])/)) {
      try {
        var previewText;
        // previewText = this.setPreviewText(this.editableDivRef.current.innerText);
        previewText = this.setPreviewText(question.question);
        // console.log(`katex div has been set from render ${this.editableDivRef.current.innerText}`);
        this.setState({ previewText });
      } catch (err) {
        console.log("previewText error: ", err);
      }
    }
  }

  render() {
    const { question, questionIndex, disableAnswerButtons, answers } = this.props;
    const { imageSizeMaxed, selectedAnswer, previewText } = this.state;

    return (
      <li className="orderedQuestion">
        <span className="dummySpan takeQuizDummySpan">.</span>
        {!isEmpty(question.questionImage) ? (
          <div className="imgContainer">
            <img
              onClick={function (e) {
                this.setState(
                  function (prevState) {
                    return {
                      imageSizeMaxed: !prevState.imageSizeMaxed,
                    };
                  }.bind(this)
                );
              }.bind(this)}
              className={classnames("createQuizImgItem", {
                "createQuizImgItemMax": imageSizeMaxed === true,
              })}
              alt={`img_q_${questionIndex}`}
              src={`\\${question.questionImage.path}`}
            ></img>
          </div>
        ) : null}

        {question.question.match(/(\[math\].*?\[\/math\])/) && !isEmpty(previewText) ? (
          <div className="previewTextDiv TakeQuizKatex">
            <span className="katex" ref={this.katexDiv}>
              {previewText}
            </span>
          </div>
        ) : (
          question.question.split("\n").map(
            function (line, index) {
              return (
                <div key={question._id + `_line${index}`}>
                  <p className="questionParagraph">{line}</p>
                  <p className="newLine"></p>
                </div>
              );
            }.bind(this)
          )
        )}

        <ol className="orderedAnswersList">
          {question.potentialAnswers.map(
            function (answer) {
              return (
                <li
                  key={answer._id}
                  className={classnames("orderedAnswer", {
                    "selectedAnswer": answer._id === selectedAnswer,
                    "disabled": disableAnswerButtons,
                  })}
                  onClick={function () {
                    if (disableAnswerButtons) return;
                    this.setState({ selectedAnswer: answer._id });
                    this.setAnswer(question._id, answer._id);
                  }.bind(this)}
                >
                  <span className="dummySpan takeQuizDummySpanAnswer">.</span>
                  <input
                    className="orderedAnswerRadio"
                    type="radio"
                    name={question._id}
                    id={answer._id}
                    value={answer.potentialAnswer}
                    disabled={disableAnswerButtons}
                  />
                  <label
                    className={classnames("orderedAnswerLabel", {
                      "orderedAnswerLabelWrong":
                        !isEmpty(
                          answers.filter(function (answerObj) {
                            return answerObj.questionId === question._id;
                          })
                        ) &&
                        answers.filter(function (answerObj) {
                          return answerObj.questionId === question._id;
                        })[0].correct === false,
                      "orderedAnswerLabelCorrect":
                        !isEmpty(
                          answers.filter(function (answerObj) {
                            return answerObj.questionId === question._id;
                          })
                        ) &&
                        answers.filter(function (answerObj) {
                          return answerObj.questionId === question._id;
                        })[0].correct === true,
                      "orderedAnswerLabelCorrectOther": answer.correctAnswer,
                    })}
                    htmlFor={answer._id}
                  >
                    <TakeQuiz_Answer_Item answer={answer} />
                  </label>
                </li>
              );
            }.bind(this)
          )}
        </ol>
      </li>
    );
  }

  setPreviewText(someText) {
    if (someText === null) return;
    var componentsReg = /(\[math\].*?\[\/math\])/gu;

    // console.log("someText:", someText);

    var splitComponents = someText.split("\n");
    splitComponents = splitComponents.map(function (item, index) {
      if (index != splitComponents.length - 1) return item + " ...LBRK... ";
      else return item;
    });

    var lineBreakSplitKeepDelimiter = splitComponents.join("");

    splitComponents = lineBreakSplitKeepDelimiter;
    splitComponents = splitComponents.split(componentsReg);

    var reg = /\[math\](.*?)\[\/math\]/gu;

    splitComponents = splitComponents.filter(function (item) {
      return item != "";
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
        // newSplitComponents.splice.apply(newSplitComponents, [newSplitComponents.length, 0].concat(splitComponents[i]));
        var splitKeepDelimiter = splitComponents[i].map(function (item) {
          return item + " ";
        });
        newSplitComponents.push.apply(newSplitComponents, splitKeepDelimiter);
        // newSplitComponents.push.apply(newSplitComponents, splitComponents[i]);
      } else {
        newSplitComponents.push(splitComponents[i]);
      }
      katexIDs.push(generateUniqueID());
    }

    // console.log("new split components: ", newSplitComponents);

    return (
      <div className="returnKatexDiv">
        {" "}
        {newSplitComponents.map(
          function (part, i) {
            // if (i!=newSplitComponents.length-1)
            if (newSplitComponents[i].match(reg) != null) {
              // console.log("katex: ", newSplitComponents[i]);
              // console.log("printing katex");
              return <KaTeX_Item key={katexIDs[i]} katexText={newSplitComponents[i]} newTimeout={this.props.newTimeout} />;
            } else if (part === "...LBRK... ") {
              // console.log("printing line break");
              return <div key={katexIDs[i]} className="dummyFiller"></div>;
            } else {
              // console.log("printing non-katex");
              // console.log("non-katex: ", newSplitComponents[i]);
              return (
                <p key={katexIDs[i]} className="nonKatexSpan">
                  {newSplitComponents[i].toString()}
                </p>
              );
            }

            // return <span key={i} className={newSplitComponents[i].match(reg) != null ? "relevantKeywords" : "notRelevantKeywords"}>
            //     {newSplitComponents[i]}
            // </span>
          }.bind(this)
        )}{" "}
      </div>
    );
  }
}

export default TakeQuiz_Question_Item;

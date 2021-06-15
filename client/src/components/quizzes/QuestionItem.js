import React, { Component } from "react";
import KaTeX_Item from "./KaTeX_Item";
import classnames from "classnames";
import AnswerItem from "./AnswerItem";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/is-empty";
import SpinnerDelayed from "../common/SpinnerDelayed";
import { v4 as generateUniqueID } from "uuid";

export class QuestionItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      katexText: "",
      imageSizeMaxed: false,
    };
    this.setPreviewText = this.setPreviewText.bind(this);
    this.questionOnChange = this.props.questionOnChange;
    this.questionOnChangeKeyDown = this.props.questionOnChangeKeyDown;
    this.answerOnChange = this.props.answerOnChange;
    this.setCorrectAnswer = this.props.setCorrectAnswer;
    this.addAnswer = this.props.addAnswer;
    this.deleteAnswer = this.props.deleteAnswer;
    this.deleteQuestion = this.props.deleteQuestion;
    this.questionInputOnFocus = this.props.questionInputOnFocus;
    this.questionInputOnBlur = this.props.questionInputOnBlur;
    this.onPasteHandler = this.props.onPasteHandler;
    this.onQuestionImageUpload = this.props.onQuestionImageUpload;
    this.deleteQuestionImage = this.props.deleteQuestionImage;

    this.editableDivRef = React.createRef();
    this.uploadImageBtnRef = React.createRef();
    this.uploadImageFormRef = React.createRef();
    this.katexDiv = React.createRef();
  }

  componentDidMount() {
    if (!isEmpty(this.props.question.question)) {
      this.editableDivRef.current.innerText = this.props.question.question;
    }
  }

  componentDidUpdate() {
    const { disableTextInputs } = this.props;
    const { disableInput } = this.state;
    if (disableTextInputs && !disableInput) {
      this.setState({ activeElement: document.activeElement }, () => {
        this.setState({ disableInput: true });
      });
    } else if (!disableTextInputs && disableInput) {
      this.setState({ disableInput: false }, () => {
        this.state.activeElement.focus();
      });
    }
  }

  render() {
    const { questionIndex, questions, question } = this.props;
    const { imageSizeMaxed, disableInput } = this.state;

    // console.log("single question katex item: ", this.katexDiv.current);
    // console.log("katexDiv render contents: ", this.katexDiv.current);

    // var previewText = this.setPreviewText(question.question);
    try {
      var previewText;
      if (
        this.editableDivRef &&
        this.editableDivRef.current &&
        this.editableDivRef.current.innerText &&
        this.editableDivRef.current.innerText.match(/(\[math\].*?\[\/math\])/)
      ) {
        // console.log("setting preview text", this.editableDivRef.current.innerText);
        // previewText = this.setPreviewText(this.editableDivRef.current.innerHTML);
        previewText = this.setPreviewText(this.editableDivRef.current.innerText);
      } else if (question.question && question.question.match(/(\[math\].*?\[\/math\])/)) {
        previewText = this.setPreviewText(question.question);
      }
      // console.log(`katex div has been set from render ${this.editableDivRef.current.innerText}`);
    } catch (err) {
      // console.log("previewText error: ", err);
    }

    return (
      <li
        key={questionIndex}
        className={classnames("createQuizQuestionLI", {
          "tensLi": questionIndex >= 9, // i.e. number 10 and above
          "hundredsLi": questionIndex >= 99,
        })}
      >
        {isEmpty(questions[questionIndex].questionImage) ? null : questions[questionIndex].questionImage === "uploading" ? (
          <div className="questionItemImageSpinnerDiv">
            <div className="questionItemImageSpinnerDivSpinnerWrapper">
              <SpinnerDelayed isLoading={true} />
            </div>
            <p>Uploading image...</p>
          </div>
        ) : !isEmpty(questions[questionIndex].questionImage.error) ? (
          <p className="ErrorUploadingImage">
            An error occurred while uploading the image. Please make sure file size is under 500KB and of type JPG or PNG.
          </p>
        ) : (
          // <p className="ErrorUploadingImage">{questions[questionIndex].questionImage.error}</p>
          <div
            className={classnames("imgContainer", {
              "imgContainerZoomed": imageSizeMaxed === true,
            })}
          >
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
              src={question.questionImage.path}
            ></img>
            <span className="maxedImageBackground"></span>
            <img
              onClick={function (e) {
                this.deleteQuestionImage(questionIndex, this.uploadImageFormRef.current);
              }.bind(this)}
              className={classnames("createQuizAddImage createQuizDeleteQuestionImageRubbishBin", {
                "createQuizDeleteQuestionImageRubbishBinZoom": imageSizeMaxed === true,
              })}
              alt="Remove image"
              title="Remove image"
              src={"./images/rubbish-bin.svg"}
            ></img>
          </div>
        )}

        <div className="questionItemWrapperDiv">
          <span className="dummySpan">.</span>
          <div className="createQuizQuestionAndCountContainer">
            <div className="questionItemInnerWrapperDiv">
              {question.question.match(/(\[math\].*?\[\/math\])/) ? (
                <div className="previewTextDiv">
                  <p className="previewQuestionParagraph">Question {questionIndex + 1} preview:</p>

                  <span className="katex" ref={this.katexDiv}>
                    {previewText}
                  </span>
                </div>
              ) : null}

              <div className="questionInputAndDeleteDiv">
                <div
                  ref={this.editableDivRef}
                  // onChange={this.questionOnChange}
                  onKeyUp={function (e) {
                    this.questionOnChange(e, questionIndex);
                  }.bind(this)}
                  onKeyDown={function (e) {
                    this.questionOnChangeKeyDown(e, questionIndex);
                  }.bind(this)}
                  onFocus={this.questionInputOnFocus}
                  onBlur={this.questionInputOnBlur}
                  onPaste={function (e) {
                    this.onPasteHandler(e, questionIndex);
                  }.bind(this)}
                  className="createQuizQuestionTextDiv inputQuestionText"
                  // contentEditable="plaintext-only
                  contentEditable={disableInput ? "false" : "true"}
                  suppressContentEditableWarning={true}
                >
                  {/* {isEmpty(question.question) ?  */}
                  <span className="placeholderSpan">Question text here</span>
                  {/* : null} */}
                </div>
                <div
                  className={classnames("createQuizDeleteAndImageDiv", {
                    "createQuizDeleteAndImageDivLifted": questionIndex > 1,
                  })}
                >
                  {questionIndex > 1 ? (
                    // <div onClick={function () { this.deleteQuestion(questionIndex) }.bind(this)}
                    //     className="createQuizDeleteAnswer createQuizDeleteQuestion">+</div>
                    // : null}
                    <div className="createQuizAddImageWrapperDiv">
                      <img
                        onClick={function () {
                          this.deleteQuestion(questionIndex);
                        }.bind(this)}
                        className="createQuizAddImage createQuizDeleteQuestionRubbishBin"
                        alt="Remove question"
                        title="Remove question"
                        src={"./images/rubbish-bin.svg"}
                      ></img>
                    </div>
                  ) : null}
                  <div className="createQuizAddImageWrapperDiv">
                    <form ref={this.uploadImageFormRef}>
                      <input
                        style={{ "display": "none" }}
                        type="file"
                        id="openFile"
                        ref={this.uploadImageBtnRef}
                        onChange={function (e) {
                          this.onQuestionImageUpload(e.target.files[0], questionIndex, this.uploadImageFormRef.current);
                        }.bind(this)}
                        // onChange={(e) => console.log('upload: ', e.target.files[0])}
                      />
                    </form>
                    <img
                      className="createQuizAddImage"
                      alt="Attach image"
                      title="Attach image"
                      src="./images/photo-camera.svg"
                      onClick={function (e) {
                        this.uploadImageBtnRef.current.click();
                      }.bind(this)}
                    ></img>
                  </div>
                </div>

                {/* <textarea
                            maxLength="500"
                            cols="100"
                            rows="1"
                            className="inputQuestionTextArea"
                            autoComplete="off"
                            type="text"
                            name="question_Text"
                            // onKeyDown={this.questionOnChange}
                            // onKeyUp={function (e) { this.questionOnChange(e, questionIndex) }.bind(this)}
                            onChange={function (e) { this.questionOnChange(e, questionIndex) }.bind(this)}
                            placeholder="Question text here"
                        /> */}
              </div>
            </div>

            <div className="questioInputErrorsDiv">
              {500 - questions[questionIndex].question.length <= 100 ? (
                500 - questions[questionIndex].question.replace(new RegExp("\n", "g"), "").length < 0 ? (
                  <span className="questionLengthCountLeft">Character limit exceeded</span>
                ) : (
                  <span className="questionLengthCountLeft">
                    {500 - questions[questionIndex].question.replace(new RegExp("\n", "g"), "").length} characters left
                  </span>
                )
              ) : null}

              {question.notEnoughSpace ? <span className="questionLengthCountLeft notEnoughSpace">Not enough space to paste</span> : null}
            </div>
          </div>
        </div>
        {/* Potential answers */}

        <ol className="createQuizPotentialAnswersOL">
          {question.potentialAnswers.map(
            function (potentialAnswer, answerIndex) {
              return (
                <AnswerItem
                  key={potentialAnswer._id}
                  disableInput={disableInput}
                  questionIndex={questionIndex}
                  answerIndex={answerIndex}
                  potentialAnswer={potentialAnswer}
                  answerOnChange={this.answerOnChange}
                  setCorrectAnswer={this.setCorrectAnswer}
                  deleteAnswer={this.deleteAnswer}
                  newTimeoutAnswer={this.props.newTimeoutAnswer}
                />
              );
            }.bind(this)
          )}
          <div
            onClick={function () {
              this.addAnswer(questionIndex);
            }.bind(this)}
            className="createQuizAddAnswer"
          >
            +
          </div>
        </ol>
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
              return <KaTeX_Item key={katexIDs[i]} katexText={newSplitComponents[i]} newTimeout={this.props.newTimeout} />;
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

export default QuestionItem;

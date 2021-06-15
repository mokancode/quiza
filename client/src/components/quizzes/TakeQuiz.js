import React, { Component } from "react";
import TakeQuiz_Question_Item from "./TakeQuiz_Question_Item";
import SpinnerDelayed from "../common/SpinnerDelayed";
import Spinner from "../common/Spinner";
import Star from "./Star";
import "./TakeQuiz.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import isEmpty from "../../validation/is-empty";
import compareQuizzes from "../../validation/compareQuizzes";
import { changeNavbarShadow } from "../../actions/styleActions";
import axios from "axios";
import { Element, animateScroll as scroll, scroller, Events } from "react-scroll";

export class TakeQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizDoneState: false,
      quizSubmitState: false,
      answers: [], // A list containing question IDs. Membership means user has chosen an answer for that question.
      stars: [],
      errors: {},
      quiz: null,
      grade: {},
      alreadyRated: null,
      alreadyReviewed: null,
      reviewText: "",
      notEnoughSpace: false,
    };

    this.submitReview = this.submitReview.bind(this);
    this.quizSubmit = this.quizSubmit.bind(this);
    this.quizDone = this.quizDone.bind(this);
    this.setAnswer = this.setAnswer.bind(this);
    this.setStar = this.setStar.bind(this);
    this.reviewInputOnFocus = this.reviewInputOnFocus.bind(this);
    this.reviewInputOnBlur = this.reviewInputOnBlur.bind(this);
    this.questionOnChange = this.questionOnChange.bind(this);
    this.questionOnChangeKeyDown = this.questionOnChangeKeyDown.bind(this);
    this.editableDivRef = React.createRef();
    this.reviewPlaceholderRef = React.createRef();

    //refs

    this.answerAllErrorDiv = React.createRef();
    this.starsWrapper = React.createRef();
    this.allStarsContainer = React.createRef();
    this.bottomButtonsContainer = React.createRef();
    this.submitQuizBtnDone = React.createRef();
  }

  componentDidMount() {
    // console.log("take quiz id: ", this.props.match.params.id);

    // Remove this line later (for production)
    // this.props.changeNavbarShadow('bright');

    if (!isEmpty(this.state.quiz)) {
      scroll.scrollToTop({
        duration: 500,
        delay: 100,
        smooth: "easeInOutQuad",
        containerId: "contactPage",
        offset: 50, // Scrolls to element + 50 pixels down the page
      });
      return;
    }

    axios
      .get(`/api/quizzes/takequiz/${this.props.match.params.id}`)
      .then(
        function (res) {
          this.setState(
            { quiz: res.data },
            function () {
              var quiz = this.state.quiz;
              document.title = quiz.name;
              var { auth } = this.props;
              if (auth.isAuthenticated === false) return;
              var alreadyRated = quiz.rating.ratingArray
                .map(function (rating) {
                  return rating.userId;
                })
                .filter(function (userId) {
                  return userId.toString() === auth.user.id.toString();
                });

              var alreadyReviewed = quiz.reviews
                .map(function (review) {
                  return review.userId;
                })
                .filter(function (userId) {
                  return userId.toString() === auth.user.id.toString();
                });

              // If !isEmpty(alreadyRated) is truthy then it means the quiz was already rated by current user.
              if (!isEmpty(alreadyRated)) this.setState({ alreadyRated: true });
              else this.setState({ alreadyRated: false });
              if (!isEmpty(alreadyReviewed)) this.setState({ alreadyReviewed: true });
              else this.setState({ alreadyReviewed: false });

              scroll.scrollToTop({
                duration: 500,
                delay: 100,
                smooth: "easeInOutQuad",
                containerId: "contactPage",
                offset: 50, // Scrolls to element + 50 pixels down the page
              });
            }.bind(this)
          );

          if (!isEmpty(res.data.errors)) {
            this.setState({ errors: res.data.errors });
          }
        }.bind(this)
      )
      .catch(
        function (err) {
          this.setState({ errors: err.response.data, quiz: null }, function () {
            // console.log(typeof this.state.errors.quiz);
          });
          console.log("take err: ", err.response.data);
        }.bind(this)
      );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("take quiz nextProps: ", nextProps);

    if (!isEmpty(nextProps.quizzes.quizzes) && isEmpty(prevState.quiz) && !compareQuizzes(nextProps.quizzes.quizzes, prevState.quiz)) {
      var relevantQuiz = nextProps.quizzes.quizzes.filter(
        function (quiz) {
          return quiz._id === nextProps.match.params.id;
        }.bind(this)
      )[0];

      const { auth } = nextProps;

      var alreadyRated = relevantQuiz.rating.ratingArray
        .map(function (rating) {
          return rating.userId;
        })
        .filter(function (userId) {
          return userId === auth.user.id;
        });

      var alreadyReviewed = relevantQuiz.reviews
        .map(function (review) {
          return review.userId;
        })
        .filter(function (userId) {
          return userId.toString() === auth.user.id.toString();
        });

      return {
        quiz: relevantQuiz,
        alreadyRated: !isEmpty(alreadyRated),
        alreadyReviewed: !isEmpty(alreadyReviewed),
      };
    }
    return null;
  }

  componentDidUpdate(nextProps, prevState) {
    // if (!prevState.quiz) console.log("component update NO QUIZ YET");
    // if (prevState.quiz) console.log("component update QUIZ LOADED SUCCESSFULLY");
    // console.log("component update: ", prevState)

    // console.log("take componentDidUpdate prevState: ", prevState);
    // console.log("take update param id: ", this.props.match.params.id);

    if (!isEmpty(prevState.quiz) && nextProps.styles.navbarShadow === "dark") {
      this.props.changeNavbarShadow("bright");
    }
  }

  quizDone(e) {
    e.preventDefault();
    // console.log("quiz done func", this.state);
    var { quizDoneState, answers, quiz, errors } = this.state;

    var answerAllErrorDiv = this.answerAllErrorDiv.current;

    // this.setState({ quizDoneState: true });

    if (answers.length === quiz.questionsList.length && quizDoneState === false) {
      for (var i = 0; i < Object.keys(answerAllErrorDiv.classList).length; i++) {
        if (answerAllErrorDiv.classList[Object.keys(answerAllErrorDiv.classList)[i]] === "answerAllErrorDivVisibleNoAnim") {
          answerAllErrorDiv.classList.remove("answerAllErrorDivVisibleNoAnim");
          answerAllErrorDiv.classList.add("answerAllErrorDivInvisible");
          break;
        }
      }

      var submitBtnDone = this.submitQuizBtnDone.current;
      submitBtnDone.classList.remove("mInvisible");
      submitBtnDone.classList.add("submitQuizBtnDoneInvisibleAnim");

      setTimeout(
        function () {
          this.setState({ quizDoneState: true });
        }.bind(this),
        450
      );
    } else {
      // console.log("submit not all questions answered");
      // console.log("errors: ", errors);
      // return;
      errors.answerall = "Some question(s) was left unanswered!";
      this.setState({ errors });

      console.log("done error length: ", Object.keys(answerAllErrorDiv.classList).length);

      for (var i = 0; i < Object.keys(answerAllErrorDiv.classList).length; i++) {
        if (answerAllErrorDiv.classList[Object.keys(answerAllErrorDiv.classList)[i]] === "answerAllErrorDivInvisible") {
          return;
        }
      }

      var doesContainVisibleNoAnim = false;
      for (var i = 0; i < Object.keys(answerAllErrorDiv.classList).length; i++) {
        if (answerAllErrorDiv.classList[Object.keys(answerAllErrorDiv.classList)[i]] === "answerAllErrorDivVisibleNoAnim") {
          doesContainVisibleNoAnim = true;
        }
      }

      if (doesContainVisibleNoAnim === false) {
        answerAllErrorDiv.classList.add("answerAllErrorDivVisible");
        setTimeout(function () {
          answerAllErrorDiv.classList.remove("answerAllErrorDivVisible");
          answerAllErrorDiv.classList.add("answerAllErrorDivVisibleNoAnim");
        }, 450);
      } else {
        answerAllErrorDiv.classList.add("answerAllErrorDivShake");
        setTimeout(function () {
          answerAllErrorDiv.classList.remove("answerAllErrorDivShake");
        }, 250);
      }
    }
  }

  quizSubmit(e) {
    e.preventDefault();
    const { quizDoneState, answers, grade, stars, alreadyRated, alreadyReviewed } = this.state;
    var { quiz } = this.state;
    const { auth } = this.props;
    if (isEmpty(stars) && alreadyRated === false && auth.user.id !== quiz.quizCreatorId && auth.isAuthenticated !== false) {
      var starsWrapper = this.starsWrapper.current;
      starsWrapper.classList.add("starsWrapperShake");
      setTimeout(function () {
        starsWrapper.classList.remove("starsWrapperShake");
      }, 250);
      return;
    }

    var isMyQuiz = false;
    if (auth.user.id === quiz.quizCreatorId && auth.isAuthenticated !== false) {
      isMyQuiz = true;
    }

    if (auth.isAuthenticated !== false && !isMyQuiz && !alreadyReviewed) {
      this.setState(
        { quizSubmitState: true },
        function (e) {
          this.editableDivRef.current.scrollIntoView({ behavior: "smooth" });
        }.bind(this)
      );
    }

    var count = 0;

    axios
      .get(`/api/quizzes/getquizanswers/${this.props.match.params.id}`)
      .then(
        function (res) {
          this.setState(
            { quiz: res.data, errors: res.data.errors },
            function () {
              if (!isEmpty(res.data.errors)) return;

              // This is the implementation of the above loop using state. In TakeQuiz_Question_Item.js instead of using refs
              // I make use of the classnames package and state.

              var quizWithAnswers = res.data;

              for (var i = 0; i < quizWithAnswers.questionsList.length; i++) {
                var questionObj = quizWithAnswers.questionsList[i];
                var chosenAnswer = answers.filter(function (elt) {
                  return elt.questionId === questionObj._id;
                })[0];

                var correctAnswerID = questionObj.potentialAnswers.filter(function (potentialAnswer) {
                  return potentialAnswer.correctAnswer === true;
                })[0]._id;

                const updatedAnswer = answers.find((ans) => ans.questionId === questionObj._id);
                if (chosenAnswer.answerId === correctAnswerID) {
                  updatedAnswer.correct = true;
                  count++;
                } else updatedAnswer.correct = false;
              }
              this.setState({ answers });

              grade.num = Math.round((count / quiz.questionsList.length) * 100);
              grade.letter = this.convertGradeNumToLetter(grade.num);

              this.setState(
                { grade, numberOfCorrectAnswers: count },
                function () {
                  this.bottomButtonsContainer.current.classList.add("bottomButtonsContainerInvisible");
                  this.allStarsContainer.current.classList.add("allStarsContainerInvisible");
                }.bind(this)
              );

              if (alreadyRated === true || isEmpty(stars)) return;

              const rateData = {
                quizId: this.state.quiz._id,
                quizRating: stars,
              };

              axios
                .post("/api/quizzes/ratequiz", rateData)
                .then(function (res) {
                  // console.log("quiz rate successful: ", res);
                })
                .catch(
                  function (err) {
                    console.log("quiz rate error:", err.response.data);
                    this.setState({ errors: err.response.data });
                  }.bind(this)
                );
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(
        function (err) {
          // console.log("err", err);
          this.setState({ errors: err.response.data, quiz: null }, function () {
            // console.log(typeof (this.state.errors.quiz));
          });
          console.log("take err: ", err.response.data);
        }.bind(this)
      );
  }

  submitReview(e) {
    e.preventDefault();

    this.setState({ isLoading: true, errors: {} });

    const { reviewText, quiz } = this.state;

    const reviewData = {
      reviewText,
      quizId: quiz._id,
    };

    axios
      .post("/api/quizzes/addquizreview", reviewData)
      .then(
        function (res) {
          this.setState({ reviewUploaded: true });
        }.bind(this)
      )
      .catch(
        function (err) {
          if (!isEmpty(err.response.data) && !isEmpty(err.response.data.errors)) {
            this.setState({ errors: err.response.data.errors, isLoading: false });
          } else this.setState({ isLoading: false });
        }.bind(this)
      );
  }

  render() {
    const {
      quiz,
      quizDoneState,
      quizSubmitState,
      stars,
      grade,
      numberOfCorrectAnswers,
      errors,
      alreadyRated,
      alreadyReviewed,
      reviewUploaded,
      reviewText,
      notEnoughSpace,
      isLoading,
    } = this.state;
    const { auth } = this.props;

    return (
      <div
        className={classnames("TakeQuizDiv", {
          ready: !isEmpty(quiz),
        })}
      >
        {!isEmpty(errors) && !isEmpty(errors.quiz) ? (
          <div className="draftErrorDiv">
            <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
            {typeof errors.quiz === "string" ? (
              <span className="errorSpan draftErrorSpan">{errors.quiz}</span>
            ) : typeof errors.quiz === "object" ? (
              <div className="TakeQuizObjectError">
                {errors.quiz.map(function (errElt, index) {
                  return (
                    <span key={`takeQuizError${index}`} className="errorSpan draftErrorSpan">
                      {errElt.text}
                    </span>
                  );
                  // if (errElt.type === "p") return <p className="takeQuizObjErrorParagraph">{errElt.text}</p>
                  // else if (errElt.type === "span") return <span className="takeQuizObjErrorSpan">{errElt.text}</span>
                })}
              </div>
            ) : null}
          </div>
        ) : null}
        {!isEmpty(quiz) ? (
          <div>
            <form className="takeQuizForm" onSubmit={this.quizSubmit}>
              <h1 className="takeQuizName">{quiz.name}</h1>
              <ol className="orderedQuestionsList">
                {quiz.questionsList.map(
                  function (question, questionIndex) {
                    return (
                      <TakeQuiz_Question_Item
                        key={question._id}
                        question={question}
                        questionIndex={questionIndex}
                        disableAnswerButtons={quizSubmitState || quizDoneState}
                        setAnswer={this.setAnswer}
                        answers={this.state.answers}
                      />
                    );
                  }.bind(this)
                )}
              </ol>

              <div className="bottomContainer">
                <div className="bottomErrorAndStarsContainer">
                  {!isEmpty(grade) ? (
                    <div className="gradeDiv">
                      <p className="gradeParagraph">
                        Grade: {grade.num} ({grade.letter})
                      </p>
                      <p className="gradeParagraph">
                        {numberOfCorrectAnswers} correct out of {quiz.questionsList.length}
                      </p>
                    </div>
                  ) : null}

                  <div ref={this.answerAllErrorDiv} className={classnames("answerAllErrorDiv")}>
                    <img className="answerAllErrorImage" src="/images/warning.svg" alt="Attention"></img>
                    <p className="answerAllErrorParagraph">Some question(s) was left unanswered!</p>
                  </div>

                  <div
                    ref={this.starsWrapper}
                    className={classnames("starsWrapper", {
                      invisible:
                        auth.isAuthenticated === false
                          ? true
                          : quizDoneState === false ||
                            quizSubmitState === true ||
                            alreadyRated === true ||
                            quiz.quizCreatorId === auth.user.id,
                    })}
                  >
                    <div className="starsAndParagraphContainer">
                      <p className="rateThisQuizParagraph">Rate this quiz to get your grade: </p>
                      <div ref={this.allStarsContainer} className="rateQuizDiv allStarsContainer">
                        <Star
                          starFullString="starOne"
                          starFullNum={1}
                          starHalfString="starZeroHalf"
                          starHalfNum={0.5}
                          stars={stars}
                          setStar={this.setStar}
                        />
                        <Star
                          starFullString="starTwo"
                          starFullNum={2}
                          starHalfString="starOneHalf"
                          starHalfNum={1.5}
                          stars={stars}
                          setStar={this.setStar}
                        />
                        <Star
                          starFullString="starThree"
                          starFullNum={3}
                          starHalfString="starTwoHalf"
                          starHalfNum={2.5}
                          stars={stars}
                          setStar={this.setStar}
                        />
                        <Star
                          starFullString="starFour"
                          starFullNum={4}
                          starHalfString="starThreeHalf"
                          starHalfNum={3.5}
                          stars={stars}
                          setStar={this.setStar}
                        />
                        <Star
                          starFullString="starFive"
                          starFullNum={5}
                          starHalfString="starFourHalf"
                          starHalfNum={4.5}
                          stars={stars}
                          setStar={this.setStar}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={this.bottomButtonsContainer} className="bottomButtonsContainer">
                  <button
                    ref={this.submitQuizBtnDone}
                    type="button"
                    onClick={this.quizDone}
                    className={classnames("submitQuizBtn done", { mInvisible: quizDoneState === true })}
                  >
                    Done
                  </button>

                  <button
                    className={classnames("submitQuizBtn submit", {
                      mVisible: quizDoneState === true,
                    })}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : !isEmpty(errors) && !isEmpty(errors.quiz) ? null : (
          <div className="loadingQuizzesDiv">
            <p className="loadingQuizzesParagraph">Loading quiz...</p>
            <div className="spinnerDivQuizzes spinnerDivTakeQuiz">
              <SpinnerDelayed isLoading={true} />
            </div>
          </div>
        )}

        {(!isEmpty(errors) &&
          (isEmpty(errors.quizDeletedByServerDueToDataCorruption) || isEmpty(errors.draft) || isEmpty(errors.isHidden))) ||
        (quizSubmitState === true && alreadyReviewed != null && alreadyReviewed != true) ? (
          <div
            className={classnames("takeQuizReviewDivWrapper", {
              takeQuizReviewDivWrapperShow: quizSubmitState === true && alreadyReviewed != null && alreadyReviewed != true,
            })}
          >
            <form className="takeQuizReviewDiv" onSubmit={this.submitReview}>
              <p>What did you think of this quiz? (optional)</p>

              <div
                ref={this.editableDivRef}
                // onChange={this.onChange}
                onKeyUp={function (e) {
                  this.questionOnChange(e);
                }.bind(this)}
                onKeyDown={function (e) {
                  this.questionOnChangeKeyDown(e);
                }.bind(this)}
                onFocus={this.reviewInputOnFocus}
                onBlur={this.reviewInputOnBlur}
                name="reviewText"
                onPaste={function (e) {
                  this.onPasteHandler(e);
                }.bind(this)}
                className="createQuizQuestionTextDiv inputQuestionText reviewInput"
                // contentEditable="plaintext-only
                contentEditable="true"
              >
                <span ref={this.reviewPlaceholderRef} className="placeholderSpan">
                  Type here
                </span>
              </div>

              <div className="questioInputErrorsDiv takeQuizQuestioInputErrorsDiv">
                {500 - reviewText.replace(new RegExp("\n", "g"), "").length <= 100 ? (
                  <p className="questionLengthCountLeft">
                    <span
                      className={classnames("", {
                        lessThanSixtyCharsLeft: 500 - reviewText.replace(new RegExp("\n", "g"), "").length <= 60,
                        lessThanThirtyCharsLeft: 500 - reviewText.replace(new RegExp("\n", "g"), "").length <= 30,
                        lessThanTenCharsLeft: 500 - reviewText.replace(new RegExp("\n", "g"), "").length <= 10,
                      })}
                    >
                      {500 - reviewText.replace(new RegExp("\n", "g"), "").length}
                    </span>{" "}
                    characters left
                  </p>
                ) : null}

                {notEnoughSpace ? <span className="questionLengthCountLeft notEnoughSpace">Not enough space to paste</span> : null}
                {!isEmpty(errors) && !isEmpty(errors.review) ? (
                  <span className="questionLengthCountLeft notEnoughSpace">{errors.review}</span>
                ) : null}
              </div>

              {reviewText.length > 0 ? (
                <button
                  className={classnames("submitBtn takeQuizSubmitReviewBtn", {
                    uploadQuizBtnLoading: isLoading === true,
                  })}
                  onClick={this.submitReview}
                  disabled={isLoading}
                >
                  Submit
                </button>
              ) : null}
              {reviewUploaded ? (
                <div className="settingsSavedWrapper">
                  <span className="errorSpan registerErrorSpan settingsSaved">Thank you!</span>
                </div>
              ) : null}
            </form>
          </div>
        ) : null}
      </div>
    );
  }

  reviewInputOnFocus(e) {
    // return;
    var reviewRef = e.target;

    try {
      if (reviewRef.childNodes[0].tagName === undefined && reviewRef.innerHTML.trim() !== "") {
        return;
      }

      if (reviewRef.childNodes[0].tagName !== undefined) {
        reviewRef.focus();
        // reviewRef.innerHTML = " ";

        // console.log("focus selection: ", window.getSelection());
        // console.log("focus selection: ", reviewRef.firstChild);

        var char = 1,
          sel; // character at which to place caret

        // if (document.selection) {
        //   sel = document.selection.createRange();
        //   sel.moveStart('character', char);
        //   sel.select();
        // }
        // else {
        sel = window.getSelection();
        sel.collapse(reviewRef.firstChild, char);
        // sel.collapse(reviewRef.firstChild, reviewRef.innerHTML.length-2);
      }

      reviewRef.innerHTML = "";

      //   sel.collapse(content.firstChild, char);
      // }
    } catch (err) {
      // console.log("err");
    }
  }

  reviewInputOnBlur(e) {
    var reviewRef = e.target;
    if (reviewRef.innerHTML.trim() === "") {
      var span = document.createElement("span");
      var node = document.createTextNode("Type here...");
      span.appendChild(node);
      span.classList.add("placeholderSpan");
      // span.contentEditable = "false";
      reviewRef.appendChild(span);
    }
  }

  questionOnChange(e) {
    var questionRef = e.target;
    // this if statement below is only applicable to a contentEditable div (and not the textarea)
    // if (e.target.innerHTML.length > 500) {
    if (e.target.innerText.replace(new RegExp("\n", "g"), "").length > 500) {
      try {
        var sel = window.getSelection();
        // sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
        sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
        e.preventDefault();
        return;
      } catch (err) {
        // console.log("err");
      }
    }

    // this.setState({ reviewText: e.target.innerHTML }); // this is for contentEditable div
    this.setState({ reviewText: e.target.innerText }); // this is for contentEditable div's text online (takes new lines into account)

    this.setState(
      {
        newTimeout: setTimeout(() => {}, 500),
      },
      function () {
        setTimeout(() => {
          this.setState({ newTimeout: null });
        }, 500);
      }.bind(this)
    );
  }

  questionOnChangeKeyDown(e) {
    var questionRef = e.target;
    // this if statement below is only applicable to a contentEditable div (and not the textarea)

    if (
      (e.ctrlKey && e.keyCode === 73) || // ctrl+i
      (e.ctrlKey && e.keyCode === 66) || // ctrl+b
      (e.ctrlKey && e.keyCode === 85) // ctrl+u)
    ) {
      e.preventDefault();
      return;
    }

    // if (e.target.innerHTML.length >= 500) {
    if (e.target.innerText.replace(new RegExp("\n", "g"), "").length >= 500) {
      try {
        if (
          e.keyCode === 8 || // backspace
          e.keyCode === 46 || // delete
          e.keyCode === 37 || // left
          e.keyCode === 38 || // up
          e.keyCode === 39 || // right
          e.keyCode === 40 || // down
          (e.ctrlKey && e.keyCode === 90) || // ctrl+z
          (e.ctrlKey && e.keyCode === 65) || // ctrl+a
          (e.ctrlKey && e.keyCode === 67) || // ctrl+c
          e.keyCode === 33 || // pgup
          e.keyCode === 34 || // pgdn
          e.keyCode === 35 || // end
          e.keyCode === 36 || // home
          (e.ctrlKey && e.keyCode === 35) || // ctrl+end
          (e.ctrlKey && e.keyCode === 36) // ctrl+home
        ) {
          // fine
          // e.preventDefault();
          // e.target.focus();
          // var sel = window.getSelection();
          // sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
          // return;
        } else {
          e.preventDefault();
          return;
        }
      } catch (err) {
        // console.log("err");
      }
    }
  }

  onPasteHandler(e, questionIndex) {
    e.preventDefault();
    // return;
    // console.log("paste: ", e.clipboardData.getData('Text'));

    // if ((e.clipboardData.getData('Text').length + e.target.innerHTML.length) > 500) {
    if (e.clipboardData.getData("Text").length + e.target.innerText.replace(new RegExp("\n", "g"), "").length > 500) {
      var { reviewText, notEnoughSpace } = this.state;
      this.setState({ notEnoughSpace: true });
      this.setState({ reviewText }, function () {
        setTimeout(
          function () {
            var { reviewText, notEnoughSpace } = this.state;
            // notEnoughSpace = false;
            this.setState({ notEnoughSpace: false });
          }.bind(this),
          1200
        );
      });
      e.preventDefault();

      this.editableDivRef.current.scroll({
        behavior: "smooth",
        left: 0,
        // top: document.documentElement.scrollHeight
        // top: this.editableDivRef.current.offsetTop
        top: this.editableDivRef.current.scrollHeight,
      });

      return;
    }

    if (e.clipboardData && e.clipboardData.getData) {
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    } else if (window.clipboardData && window.clipboardData.getData) {
      var text = window.clipboardData.getData("Text");
      // insertTextAtCursor(text);
      var sel, range, html;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
        }
      } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
      }
    }
  }

  convertGradeNumToLetter(gradeNum) {
    if (gradeNum < 60.0) return "F";
    if (gradeNum >= 60.0 && gradeNum <= 67.0) return "D";
    if (gradeNum >= 67.1 && gradeNum <= 69.9) return "D+";
    if (gradeNum >= 70.0 && gradeNum <= 72.9) return "C-";
    if (gradeNum >= 73.0 && gradeNum <= 77.0) return "C";
    if (gradeNum >= 77.7 && gradeNum <= 79.9) return "C+";
    if (gradeNum >= 80.0 && gradeNum <= 82.9) return "B-";
    if (gradeNum >= 83.0 && gradeNum <= 87.0) return "B";
    if (gradeNum >= 87.1 && gradeNum <= 89.9) return "B+";
    if (gradeNum >= 90.0 && gradeNum <= 92.9) return "A-";
    if (gradeNum >= 93.0 && gradeNum <= 100.0) return "A";
  }

  setStar(stars) {
    this.setState({ stars });
  }

  setAnswer(questionId, answerId) {
    try {
      var { answers } = this.state;

      // for (var i = 0; i < answers.length; i++) {
      //     Object.keys(answers[i])
      // }

      var wasQuestionAnswered = answers.filter(function (answer, index) {
        return answer.questionId === questionId;
      });

      // console.log("answer: ", wasQuestionAnswered);

      if (isEmpty(wasQuestionAnswered)) {
        // i.e. Question wasn't answered at all yet
        var answerData = {
          questionId,
          answerId,
        };
        this.setState({ answers: answers.concat(answerData) });
      } else {
        wasQuestionAnswered = wasQuestionAnswered[0];
        var isSameAnswer = wasQuestionAnswered.answerId === answerId;

        if (isSameAnswer === false) {
          // i.e. If not the same answer
          // console.log("answer update");
          var answerData = {
            questionId,
            answerId,
          };

          var indexOfElement = answers
            .map(function (elt) {
              return elt.questionId;
            })
            .indexOf(questionId);
          answers[indexOfElement] = answerData;
          this.setState({ answers });
        } else {
          // console.log("answer don't update");
          return;
        }
      }
    } catch (err) {
      console.log("answer err:", err);
    }
  }
}

TakeQuiz.propTypes = {
  quizzes: PropTypes.object.isRequired,
  changeNavbarShadow: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  quizzes: state.quizzes,
  styles: state.styles,
  auth: state.auth,
});

export default connect(mapStateToProps, { changeNavbarShadow })(TakeQuiz);

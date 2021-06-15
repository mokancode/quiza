import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";
import StarDisplay from "../quizzes/StarDisplay";
import classnames from "classnames";
import TripleButton from "./TripleButton";
import TripleButtonCircle from "./TripleButtonCircle";
import KaTeXQuestionPreview from "./KaTeXQuestionPreview";

const QUIZ_TYPE_DRAFT = "QUIZ_TYPE_DRAFT";
const QUIZ_TYPE_POSTED = "QUIZ_TYPE_POSTED";

export class MyQuiz_Single extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.chooseQuizBtnUpperAnimStart = this.chooseQuizBtnUpperAnimStart.bind(this);
    this.chooseQuizBtnUpperAnimEnd = this.chooseQuizBtnUpperAnimEnd.bind(this);
    this.chooseQuizBtnLowerAnimStart = this.chooseQuizBtnLowerAnimStart.bind(this);
    this.chooseQuizBtnLowerAnimEnd = this.chooseQuizBtnLowerAnimEnd.bind(this);
    this.limitPeekToFive = this.props.limitPeekToFive;
    this.editQuizDraft = this.props.editQuizDraft;
    this.discardDraft = this.props.discardDraft;
    this.confirmDiscardDraft = this.props.confirmDiscardDraft;
    this.editPostedQuiz = this.props.editPostedQuiz;
    this.confirmEditPostedQuiz = this.props.confirmEditPostedQuiz;
    this.redirectToQuiz = this.props.redirectToQuiz;
    this.showReviews = this.props.showReviews;

    // refs
    this.chooseQuizBtn = React.createRef();
  }

  chooseQuizBtnUpperAnimStart() {
    this.chooseQuizBtn.current.classList.add("chooseQuizBtnUpper");
  }
  chooseQuizBtnUpperAnimEnd() {
    this.chooseQuizBtn.current.classList.remove("chooseQuizBtnUpper");
  }
  chooseQuizBtnLowerAnimStart() {
    this.chooseQuizBtn.current.classList.add("chooseQuizBtnLower");
  }
  chooseQuizBtnLowerAnimEnd() {
    this.chooseQuizBtn.current.classList.remove("chooseQuizBtnLower");
  }

  render() {
    const { quiz, quizType } = this.props;

    var quizDraft = (
      <div className="quizListItemWrapper">
        <div className="quizListItemDetailsAndPeekWrapper">
          <div className="quizInfoContainer">
            <p className="quizName">{quiz.name || "Unnamed quiz"}</p>
            <p className="QuizNumberOfQuestions quizElementHeader">{quiz.questionsList.length || "0"} questions</p>
            <div className="quizzesAllStarsContainer">
              <StarDisplay
                starFullString="starOne"
                starFullNum={1}
                starHalfString="starZeroHalf"
                starHalfNum={0.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starTwo"
                starFullNum={2}
                starHalfString="starOneHalf"
                starHalfNum={1.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starThree"
                starFullNum={3}
                starHalfString="starTwoHalf"
                starHalfNum={2.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starFour"
                starFullNum={4}
                starHalfString="starThreeHalf"
                starHalfNum={3.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starFive"
                starFullNum={5}
                starHalfString="starFourHalf"
                starHalfNum={4.5}
                rating={quiz.rating.ratingAverage}
              />
              {!isEmpty(quiz.rating.ratingArray) ? (
                <p className="basedOnNumberOfRatings">
                  {quiz.rating.ratingArray.length} rating
                  {quiz.rating.ratingArray.length > 1 ? <span>s</span> : null}
                </p>
              ) : null}
            </div>
            {quiz.teacherName ? (
              <p className="quizTeacherName quizElementHeader">
                Teacher:
                <span className="quizTeacherNameContent quizElementContent">{quiz.teacherName}</span>
              </p>
            ) : (
              <p className="quizTeacherName quizElementHeader">
                Teacher:
                <span className="quizTeacherNameContent quizElementContent">Unset</span>
              </p>
            )}
            <p className="quizCourse quizElementHeader">
              Course:
              <span className="quizCourseContent quizElementContent">
                {isEmpty(quiz.course) ||
                isEmpty(quiz.course.code) ||
                isEmpty(quiz.course.code.letters) ||
                isEmpty(quiz.course.code.digits) ||
                isEmpty(quiz.course.title) ? (
                  <span>Unset / Incomplete</span>
                ) : (
                  <span>
                    {quiz.course.code.letters}-{quiz.course.code.digits} {quiz.course.title}
                  </span>
                )}
              </span>
            </p>
            <p className="quizFieldOfStudy quizElementHeader">
              Field:
              <span className="quizFieldOfStudyContent quizElementContent">
                {isEmpty(quiz.major) || isEmpty(quiz.major.name) ? "Unset" : quiz.major.name}
              </span>
            </p>
            <p className="quizSchool quizElementHeader">
              School:
              <span className="quizSchoolContent quizElementContent">
                {isEmpty(quiz.school) || isEmpty(quiz.school.name) ? "Unset" : quiz.school.name}
              </span>
            </p>
          </div>
          <div className="quizPeekIntoQuestionsWrapper">
            <span>Preview:</span>
            <div className="quizPeekIntoQuestions">
              <ol>
                {isEmpty(quiz.questionsList)
                  ? "No questions yet"
                  : this.limitPeekToFive(quiz.questionsList).map((question) => {
                      return (
                        <li key={question._id}>
                          {isEmpty(question.question) ? (
                            <p>Unset question</p>
                          ) : question.question.match(/(\[math\].*?\[\/math\])/) ? (
                            <KaTeXQuestionPreview question={question.question} />
                          ) : (
                            <p>{question.question || "Unset question"}</p>
                          )}
                        </li>
                      );
                    })}
              </ol>
            </div>
          </div>
        </div>
        <div className="chooseQuizBtn" ref={this.chooseQuizBtn}>
          <span
            onMouseEnter={this.chooseQuizBtnUpperAnimStart}
            onMouseLeave={this.chooseQuizBtnUpperAnimEnd}
            className="discardQuizBtn"
            onClick={function () {
              this.confirmDiscardDraft(quiz._id);
            }.bind(this)}
          >
            Discard
          </span>
          <span
            onMouseEnter={this.chooseQuizBtnLowerAnimStart}
            onMouseLeave={this.chooseQuizBtnLowerAnimEnd}
            onClick={function () {
              this.editQuizDraft(quiz);
            }.bind(this)}
          >
            Edit
          </span>
        </div>
      </div>
    );

    var postedQuiz = (
      <div className="quizListItemWrapper">
        <div className="quizListItemDetailsAndPeekWrapper">
          <div className="quizInfoContainer">
            <p className="quizName">{quiz.name}</p>
            <p className="QuizNumberOfQuestions quizElementHeader">{quiz.questionsList.length} questions</p>
            <div
              className={classnames("quizzesAllStarsContainer", {
                "quizzesAllStarsContainerReviews": quiz.rating.ratingArray.length > 0,
              })}
              onClick={function (e) {
                this.showReviews(true, quiz);
              }.bind(this)}
            >
              <StarDisplay
                starFullString="starOne"
                starFullNum={1}
                starHalfString="starZeroHalf"
                starHalfNum={0.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starTwo"
                starFullNum={2}
                starHalfString="starOneHalf"
                starHalfNum={1.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starThree"
                starFullNum={3}
                starHalfString="starTwoHalf"
                starHalfNum={2.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starFour"
                starFullNum={4}
                starHalfString="starThreeHalf"
                starHalfNum={3.5}
                rating={quiz.rating.ratingAverage}
              />
              <StarDisplay
                starFullString="starFive"
                starFullNum={5}
                starHalfString="starFourHalf"
                starHalfNum={4.5}
                rating={quiz.rating.ratingAverage}
              />
              {!isEmpty(quiz.rating.ratingArray) ? (
                <p className="basedOnNumberOfRatings">
                  {quiz.rating.ratingArray.length} rating
                  {quiz.rating.ratingArray.length > 1 ? <span>s</span> : null}
                </p>
              ) : null}
            </div>
            {quiz.teacherName ? (
              <p className="quizTeacherName quizElementHeader">
                Teacher:
                <span className="quizTeacherNameContent quizElementContent">{quiz.teacherName}</span>
              </p>
            ) : null}
            <p className="quizCourse quizElementHeader">
              Course:
              <span className="quizCourseContent quizElementContent">
                {quiz.course.code.letters}-{quiz.course.code.digits} {quiz.course.title}
              </span>
            </p>
            <p className="quizFieldOfStudy quizElementHeader">
              Field:
              <span className="quizFieldOfStudyContent quizElementContent">{quiz.major.name}</span>
            </p>
            <p className="quizSchool quizElementHeader">
              School:
              <span className="quizSchoolContent quizElementContent">{quiz.school.name}</span>
            </p>
            {quiz.searchableId ? (
              <div className="inputAndErrorDiv privateQuizDiv">
                <p className="quizSearchableId quizElementHeader">
                  ID:
                  <span className="quizSearchableIdContent quizElementContent">{quiz.searchableId}</span>
                </p>

                {/* <TripleButton quizId={quiz._id} isHidden={quiz.isHidden} isPrivate={quiz.isPrivate} /> */}
                <div className="quizVisibilityDiv">
                  <p className="visibilityText">Accessibility: </p>
                  <TripleButtonCircle quizId={quiz._id} isHidden={quiz.isHidden} isPrivate={quiz.isPrivate} />
                </div>

                {/* <div className="centerCheckboxDiv">
                                    <input
                                        // onChange={this.onChange}
                                        // onBlur={this.onBlur}
                                        type="checkbox"
                                        name="hideMyQuizzes"
                                        tabIndex="3"
                                    // checked={hideMyQuizzes}
                                    ></input>
                                </div> */}
                {/* {errors.hideMyQuizzes ?
                                    <span className="errorSpan registerErrorSpan registerErrorSpanUsername">{errors.hideMyQuizzes}</span> : null} */}
              </div>
            ) : null}
          </div>
          <div className="quizPeekIntoQuestionsWrapper">
            <span>Preview:</span>
            <div className="quizPeekIntoQuestions">
              <ol>
                {this.limitPeekToFive(quiz.questionsList).map(
                  function (question) {
                    return (
                      <li key={question._id}>
                        {isEmpty(question.question) ? (
                          <p>Unset question</p>
                        ) : question.question.match(/(\[math\].*?\[\/math\])/) ? (
                          <KaTeXQuestionPreview question={question.question} />
                        ) : (
                          <p>{question.question || "Unset question"}</p>
                        )}
                      </li>
                    );
                  }.bind(this)
                )}
              </ol>
            </div>
          </div>
        </div>
        <div className="chooseQuizBtn">
          <span
            onClick={function () {
              this.redirectToQuiz(quiz._id);
            }.bind(this)}
          >
            Take
          </span>
          <span
            onClick={function () {
              this.confirmEditPostedQuiz(quiz._id);
            }.bind(this)}
          >
            Edit
          </span>
        </div>
      </div>
    );

    return <li className="quizListItem">{quizType == QUIZ_TYPE_DRAFT ? quizDraft : postedQuiz}</li>;
  }
}

export default MyQuiz_Single;

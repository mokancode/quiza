import React, { Component } from "react";
import StarDisplay from "./StarDisplay";
import isEmpty from "../../validation/is-empty";
import classnames from "classnames";
import KaTeXQuestionPreview from "../myquizzes/KaTeXQuestionPreview";

export class Quizzes_Single_Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.limitPeekToFive = this.props.limitPeekToFive;
    this.redirectToQuiz = this.props.redirectToQuiz;
    this.showReviews = this.props.showReviews;

    this.quizListItemRef = React.createRef();
  }

  componentDidMount() {
    const mRef = this.quizListItemRef.current;

    const { index } = this.props;
    const defaultDelay = 900; // ms

    const delay = index * 150 + defaultDelay;

    // mRef.style.animationDelay = `${delay}ms`;
    mRef.style.animationDelay = `${delay}ms`;
    // console.log(window.getComputedStyle(mRef));
  }

  render() {
    const { quiz, index, shuffle, shuffleOut } = this.props;

    return (
      <li
        className={classnames("quizListItem", {
          "shuffleRight": index % 2 === 0 && shuffle === true, // 1st, 3rd, 5th...
          "shuffleRightOut": index % 2 === 0 && shuffleOut === true, // 1st, 3rd, 5th...
          "shuffleLeft": index % 2 !== 0 && shuffle === true, // 2nd, 4th, 6th...
          "shuffleLeftOut": index % 2 !== 0 && shuffleOut === true, // 2nd, 4th, 6th...
        })}
      >
        <div className="quizListItemWrapper" ref={this.quizListItemRef}>
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
              <p className="quizCreator quizElementHeader">
                Made by
                <span className="quizCreatorContent quizElementContent">{quiz.quizCreator}</span>
              </p>
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
          <div
            className="chooseQuizBtn"
            onClick={function () {
              this.redirectToQuiz(quiz._id);
            }.bind(this)}
          >
            <span>Take</span>
          </div>
        </div>
      </li>
    );
  }
}

export default Quizzes_Single_Quiz;

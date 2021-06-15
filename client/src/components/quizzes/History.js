import React, { Component } from "react";
import { connect } from "react-redux";
import { searchQuizzes, notifyReviewUpdate } from "../../actions/quizActions";
import isEmpty from "../../validation/is-empty";
import "./History.css";
import Quizzes_Single_Quiz from "./Quizzes_Single_Quiz";
import QuizReviewsList from "../reviews/QuizReviewsList";
import axios from "axios";
import SpinnerDelayed from "../common/SpinnerDelayed";

export class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
      quizzesDisplay: [],
      moreQuizzesAvailable: false,
      initialLoad: null,
      shuffle: false,
      errors: {},
      isLoading: false,
    };

    this.limitPeekToFive = this.limitPeekToFive.bind(this);
    this.redirectToQuiz = this.redirectToQuiz.bind(this);
    this.loadMoreQuizzes = this.loadMoreQuizzes.bind(this);
    this.showReviews = this.showReviews.bind(this);
    this.updateHistoryQuizzes = this.updateHistoryQuizzes.bind(this);

    // refs
    this.sortByRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    axios
      .get("/api/quizzes/getmyquizhistory")
      .then(
        function (res) {
          if (!isEmpty(res.data.errors)) this.setState({ quizzes: res.data.quizHistory, errors: res.data.errors, isLoading: false });
          else this.setState({ quizzes: res.data, isLoading: false });
        }.bind(this)
      )
      .catch(
        function (err) {
          console.log("history err: ", err.response.data);
          if (String(err.response.data).match(new RegExp("proxy", "i"))) {
            var errors = {};
            errors.history = "Could not connect. Try again later.";

            this.setState({ errors, isLoading: false });
          } else this.setState({ errors: err.response.data.errors, isLoading: false });
          // console.log("err: ", err.response.data);
        }.bind(this)
      );
  }

  limitPeekToFive(questions) {
    if (questions.length > 5) {
      return questions.slice(0, 5);
    } else return questions;
  }

  redirectToQuiz(id) {
    this.props.history.push(`/quiz/${id}`);
  }

  loadMoreQuizzes(e) {
    var { quizzes, quizzesDisplay } = this.state;

    // var newLength = quizzes.slice(0, quizzesDisplay.length + 15).length;
    var newLength = quizzes.slice(0, quizzesDisplay.length + 3).length;

    if (!(quizzes.length > newLength)) {
      this.setState({ moreQuizzesAvailable: false });
    }

    if (quizzes.length > quizzesDisplay.length) {
      this.setState({ quizzesDisplay: quizzes.slice(0, newLength) });
    }
  }

  componentDidUpdate(nextProps, prevState) {
    var { quizzes, quizzesDisplay } = this.state;

    if (!isEmpty(quizzes) && isEmpty(quizzesDisplay)) {
      // this.setState({ quizzesDisplay: quizzes.slice(0, 15) });
      this.setState(
        { quizzesDisplay: quizzes.slice(0, 3) },
        function () {
          if (quizzes.length > quizzesDisplay.length) {
            this.setState({ moreQuizzesAvailable: true });
          }
        }.bind(this)
      );
    }

    // if (!isEmpty(quizzes) && isEmpty(quizzesDisplay)) {
    //     if (quizzes.length > 1) {
    //         this.setState({ quizzesDisplay: quizzes.slice(0, 1) }, function () {
    //             if (quizzes.length > quizzesDisplay.length) {
    //                 this.setState({ moreQuizzesAvailable: true })
    //             }
    //         }.bind(this));
    //     }
    // }

    // if (!isEmpty(this.props.quizzes.notifyReviewUpdate) && this.props.quizzes.notifyReviewUpdate !== "delete") {
    if (!isEmpty(this.props.quizzes.notifyReviewUpdate)) {
      this.props.notifyReviewUpdate(null);

      // return;
      axios
        .get("/api/quizzes/getmyquizhistory")
        .then(
          function (res) {
            if (!isEmpty(res.data.errors)) {
              this.setState(
                { quizzes: res.data.quizHistory, errors: res.data.errors, isLoading: false },
                function () {
                  this.updateHistoryQuizzes();
                }.bind(this)
              );
            } else this.setState({ quizzes: res.data, isLoading: false });
          }.bind(this)
        )
        .catch(
          function (err) {
            console.log("history err: ", err.response.data);
            if (String(err.response.data).match(new RegExp("proxy", "i"))) {
              var errors = {};
              errors.history = "Could not connect. Try again later.";

              this.setState({ errors, isLoading: false });
            } else this.setState({ errors: err.response.data.errors, isLoading: false });
            // console.log("err: ", err.response.data);
          }.bind(this)
        );
    }
  }

  updateHistoryQuizzes() {
    var { quizzes, quizzesDisplay } = this.state;

    var oldLength = quizzesDisplay.length;
    this.setState({ quizzesDisplay: quizzes.slice(0, oldLength) });
  }

  sortQuizzes(e) {
    e.preventDefault();

    // console.log("select: ", e.target.value);

    var { quizzes } = this.state;

    if (e.target.value === "Quiz name") {
      // console.log("Sorting by quiz name");
      quizzes.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x > y ? 1 : x < y ? -1 : 0;
        // if (x < y) { return -1; }
        // if (x > y) { return 1; }
        // return 0;
      });
    } else if (e.target.value === "Rating") {
      quizzes.sort(function (a, b) {
        var x = a.rating.ratingAverage;
        var y = b.rating.ratingAverage;
        return x < y ? 1 : x > y ? -1 : 0;
        // if (x < y) { return -1; }
        // if (x > y) { return 1; }
        // return 0;
      });
    }

    this.setState(
      { shuffle: true },
      function () {
        setTimeout(
          function () {
            this.setState(
              { quizzes, quizzesDisplay: null },
              function () {
                this.setState(
                  { shuffleOut: true },
                  function () {
                    setTimeout(
                      function () {
                        this.setState({ shuffle: false, shuffleOut: false });
                        this.sortByRef.current.focus();
                      }.bind(this),
                      300
                    );
                  }.bind(this)
                );
              }.bind(this)
            );
          }.bind(this),
          300
        );
      }.bind(this)
    );
  }

  render() {
    const { errors, quizzes, quizzesDisplay, moreQuizzesAvailable, shuffle, shuffleOut, showReviews, quizOfReviews, isLoading } =
      this.state;

    return (
      <div className="quizzesBodyWrapper historyWrapper">
        {isLoading ? (
          <div className="loadingQuizzesDiv">
            <p className="loadingQuizzesParagraph">Loading history...</p>
            <div className="spinnerDivQuizzes">
              <SpinnerDelayed isLoading={true} />
            </div>
          </div>
        ) : null}

        {!isEmpty(errors) ? (
          <div className="settingsSavedWrapper">
            <span className="errorSpan registerErrorSpan reloadPageSpan historyErrors">{errors.history}</span>
          </div>
        ) : null}
        {!isEmpty(quizzesDisplay) ? (
          <div className="quizzesBody">
            <h1 className="historyHeader">History</h1>
            <ul className="quizzesUL">
              {quizzesDisplay.map(
                function (quiz, index) {
                  return (
                    <Quizzes_Single_Quiz
                      key={quiz.quiz._id}
                      shuffle={shuffle}
                      shuffleOut={shuffleOut}
                      quiz={quiz.quiz}
                      index={index}
                      limitPeekToFive={this.limitPeekToFive}
                      redirectToQuiz={this.redirectToQuiz}
                      showReviews={this.showReviews}
                    />
                  );
                }.bind(this)
              )}
            </ul>
            {moreQuizzesAvailable === true && quizzes.length > quizzesDisplay.length ? (
              <button onClick={this.loadMoreQuizzes} className="submitBtn loadMoreQuizzes">
                Load more
              </button>
            ) : null}
          </div>
        ) : null}

        {showReviews ? <QuizReviewsList quiz={quizOfReviews} showReviews={this.showReviews} /> : null}
      </div>
    );
  }

  showReviews(state, quiz) {
    this.setState({ showReviews: state, quizOfReviews: quiz });
  }
}

const compareQuizArrays = function (a, b) {
  // nextProps (i.e. parameter "a") has the most up-to-date quizzes list.

  if (isEmpty(a) || isEmpty(b)) return false;
  if (a.length !== b.length) return false;
  else {
    for (var i = 0; i < a.length; i++) {
      var found = b.find(function (quiz) {
        return quiz._id === a[i]._id;
      });
      if (!found) return false;
    }
  }

  return true;
};

const mapStateToProps = function (state) {
  return {
    quizzes: state.quizzes,
  };
};

export default connect(mapStateToProps, { searchQuizzes, notifyReviewUpdate })(History);

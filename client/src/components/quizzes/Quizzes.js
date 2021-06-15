import React, { Component } from "react";
import { connect } from "react-redux";
import { searchQuizzes, notifyReviewUpdate } from "../../actions/quizActions";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import "./Quizzes.css";
import Quizzes_Single_Quiz from "./Quizzes_Single_Quiz";
import QuizReviewsList from "../reviews/QuizReviewsList";
import SpinnerDelayed from "../common/SpinnerDelayed";

export class Quizzes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
      quizzesDisplay: [],
      moreQuizzesAvailable: false,
      initialLoad: null,
      shuffle: false,
    };

    this.limitPeekToFive = this.limitPeekToFive.bind(this);
    this.redirectToQuiz = this.redirectToQuiz.bind(this);
    this.goBack = this.goBack.bind(this);
    this.loadMoreQuizzes = this.loadMoreQuizzes.bind(this);
    this.sortQuizzes = this.sortQuizzes.bind(this);
    this.showReviews = this.showReviews.bind(this);

    // refs
    this.sortByRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("quiz props: ", nextProps.quizzes.quizzes);
    // console.log("quiz state: ", prevState.quizzes);

    // console.log("quiz derived compare ", compareQuizArrays(nextProps.quizzes.quizzes, prevState.quizzes));

    if (!compareQuizArrays(nextProps.quizzes.quizzes, prevState.quizzes)) {
      return {
        quizzes: nextProps.quizzes.quizzes,
        quizzesDisplay: nextProps.quizzes.quizzes.slice(0, 15),
        // quizzesDisplay: nextProps.quizzes.quizzes.slice(0, 1),
        moreQuizzesAvailable: true,
      };
    }
    return null;
  }

  componentDidMount() {
    if (isEmpty(this.props.quizzes.quizzes)) {
      var params = new URLSearchParams(this.props.location.search);

      var quizTerm = {
        season: params.get("qs"),
        year: params.get("qy"),
      };

      const quizData = {
        courseId: params.get("cid"),
        majorId: params.get("mid"),
        schoolId: params.get("sid"),
        quizTerm,
        quizCreatorName: params.get("qmn"),
        searchableId: params.get("qsid"),
      };

      this.setState({ quizParamID: quizData.searchableId });
      try {
        this.props.searchQuizzes(quizData);
      } catch (err) {
        console.log("quizzes searchQuizzes err: ", err);
      }
    }
    // console.log("quiz data Quizzes: ", quizData);
  }

  limitPeekToFive(questions) {
    // console.log("limit: ", questions);
    if (questions.length > 5) {
      return questions.slice(0, 5);
    } else return questions;
  }

  redirectToQuiz(id) {
    // console.log("quiz id: ", id);
    this.props.history.push(`/quiz/${id}`);
  }

  goBack(e) {
    // this.props.history.push(`/quiz/${id}`);

    var params = new URLSearchParams(this.props.location.search);

    var quizTerm = {
      season: params.get("qs"),
      year: params.get("qy"),
    };

    const quizData = {
      courseId: params.get("cid"),
      majorId: params.get("mid"),
      schoolId: params.get("sid"),
      quizTerm,
      quizCreatorName: params.get("qmn"),
      searchableId: params.get("qsid"),
    };

    var query = "?";
    if (!isEmpty(quizData.courseId)) query += "cid=" + quizData.courseId;
    if (!isEmpty(quizData.majorId)) {
      if (query === "?") query += "mid=" + quizData.majorId;
      else query += "&mid=" + quizData.majorId;
    }

    if (!isEmpty(quizData.schoolId)) {
      if (query === "?") query += "sid=" + quizData.schoolId;
      else query += "&sid=" + quizData.schoolId;
    }

    if (!isEmpty(quizTerm.season)) {
      if (query === "?") query += "qs=" + quizTerm.season;
      else query += "&qs=" + quizTerm.season;
    }
    if (!isEmpty(quizTerm.year)) {
      if (query === "?") query += "qy=" + quizTerm.year;
      else query += "&qy=" + quizTerm.year;
    }
    if (!isEmpty(quizData.quizCreatorName)) {
      if (query === "?") query += "qmn=" + quizData.quizCreatorName;
      else query += "&qmn=" + quizData.quizCreatorName;
    }
    if (!isEmpty(quizData.searchableId)) {
      if (query === "?") query += "qsid=" + quizData.searchableId;
      else query += "&qsid=" + quizData.searchableId;
    }

    this.props.history.push(`/searchquiz${query}`);
  }

  loadMoreQuizzes(e) {
    var { quizzes, quizzesDisplay } = this.state;

    var newLength = quizzes.slice(0, quizzesDisplay.length + 15).length;
    // var newLength = quizzes.slice(0, quizzesDisplay.length + 1).length;

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
      this.setState({ quizzesDisplay: quizzes.slice(0, 15) });
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

    if (!isEmpty(this.props.quizzes.notifyReviewUpdate)) {
      this.props.notifyReviewUpdate(null);

      var params = new URLSearchParams(this.props.location.search);

      var quizTerm = {
        season: params.get("qs"),
        year: params.get("qy"),
      };

      const quizData = {
        courseId: params.get("cid"),
        majorId: params.get("mid"),
        schoolId: params.get("sid"),
        quizTerm,
        quizCreatorName: params.get("qmn"),
        searchableId: params.get("qsid"),
      };

      this.setState({ quizParamID: quizData.searchableId });
      try {
        var searchQuizzesFunc = this.props.searchQuizzes(quizData);
        var mPromise = function () {
          searchQuizzesFunc
            .then(
              function (response) {
                if (!isEmpty(response.errors)) {
                  this.setState(
                    { quizzes: response, errors: response.errors, isLoading: false },
                    function () {
                      var { quizzes, quizzesDisplay } = this.state;
                      var oldLength = quizzesDisplay.length;
                      this.setState({ quizzesDisplay: quizzes.slice(0, oldLength) });
                    }.bind(this)
                  );
                } else {
                  // this.setState({ quizzes: response, isLoading: false });
                  this.setState(
                    { quizzes: response, isLoading: false },
                    function () {
                      var { quizzes, quizzesDisplay } = this.state;
                      var oldLength = quizzesDisplay.length;
                      this.setState({ quizzesDisplay: quizzes.slice(0, oldLength) });
                    }.bind(this)
                  );
                }
              }.bind(this)
            )
            .catch(function (err) {
              console.log("quizzes update err: ", err);
              if (String(err).match(new RegExp("proxy", "i"))) {
                var errors = {};
                errors.couldNotConnect = "Could not connect. Try again later.";

                this.setState({ errors, isLoading: false });
              } else this.setState({ errors: err.errors, isLoading: false });
              // console.log("err: ", err.response.data);
            });
        }.bind(this);
        mPromise();
      } catch (err) {
        console.log("quizzes searchQuizzes err: ", err);
      }
    }
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
    const { quizzes, quizzesDisplay, moreQuizzesAvailable, shuffle, shuffleOut, showReviews, quizOfReviews, quizParamID } = this.state;

    return (
      <div className="quizzesBodyWrapper">
        <div className="goBackBtnAndHeaderDiv">
          <div className="quizzesGoBackBtnWrapperDiv">
            <button className="quizzesGoBackBtn quizName quizListItemDetailsAndPeekWrapper" type="button" onClick={this.goBack}>
              <img alt="" src="/images/left-arrow.svg"></img>
              <p>Go back</p>
            </button>
          </div>
          {!isEmpty(quizzes) && quizzes[0] !== "idError" ? (
            <h1 className="selectAQuizHeader">
              {quizzes.length} search{" "}
              <span>
                result
                {quizzes.length > 1 ? <span>s</span> : null}
              </span>
            </h1>
          ) : null}
        </div>

        {!isEmpty(quizzes) && quizzes.length > 1 && quizzes[0] !== "idError" ? (
          <div className="sortByDiv">
            <span>Sort by:</span>
            <select
              className="sortBySelect"
              ref={this.sortByRef}
              disabled={shuffle === true || shuffleOut === true}
              onChange={function (e) {
                this.sortQuizzes(e);
              }.bind(this)}
            >
              <option value="Rating">Rating</option>
              <option value="Quiz name">Quiz name</option>
            </select>
          </div>
        ) : null}

        {quizzes[0] === "idError" ? (
          <h1 className="idErrorHeader">
            Quiz by ID <span>{quizParamID}</span> either does not exist or is hidden
          </h1>
        ) : !isEmpty(quizzesDisplay) && quizzesDisplay[0] !== "idError" ? (
          <div className="quizzesBody">
            <ul className="quizzesUL">
              {quizzesDisplay.map(
                function (quiz, index) {
                  return (
                    <Quizzes_Single_Quiz
                      key={quiz._id}
                      shuffle={shuffle}
                      shuffleOut={shuffleOut}
                      quiz={quiz}
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
        ) : (
          <div className="loadingQuizzesDiv">
            <p className="loadingQuizzesParagraph">Loading quizzes...</p>
            <div className="spinnerDivQuizzes">
              <SpinnerDelayed isLoading={true} />
            </div>
          </div>
        )}

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

export default connect(mapStateToProps, { searchQuizzes, notifyReviewUpdate })(Quizzes);

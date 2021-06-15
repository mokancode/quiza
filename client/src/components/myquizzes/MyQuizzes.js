import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/is-empty";
import StarDisplay from "../quizzes/StarDisplay";
import axios from "axios";
import { setQuizDraft, getMyQuizzes } from "../../actions/quizActions";
import MyQuiz_Single from "./MyQuiz_Single";
import classnames from "classnames";
import Tilt from "react-parallax-tilt";
import TripleButton from "./TripleButton";
import SpinnerDelayed from "../common/SpinnerDelayed";
import QuizReviewsList from "../reviews/QuizReviewsList";

const QUIZ_TYPE_DRAFT = "QUIZ_TYPE_DRAFT";
const QUIZ_TYPE_POSTED = "QUIZ_TYPE_POSTED";

export class MyQuizzes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: null,
      discardQuizId: "",
      isDeletingQuiz: false,
      isEditPostedQuiz: false,
    };

    this.limitPeekToFive = this.limitPeekToFive.bind(this);
    this.editQuizDraft = this.editQuizDraft.bind(this);
    this.discardDraft = this.discardDraft.bind(this);
    this.confirmDiscardDraft = this.confirmDiscardDraft.bind(this);
    this.editPostedQuiz = this.editPostedQuiz.bind(this);
    this.confirmEditPostedQuiz = this.confirmEditPostedQuiz.bind(this);
    this.redirectToQuiz = this.redirectToQuiz.bind(this);
    this.showReviews = this.showReviews.bind(this);

    // refs
    this.areYouSureDiscardDraft = React.createRef();
    this.areYouSureEditPostedQuiz = React.createRef();
  }

  editQuizDraft(quiz) {
    // console.log("quiz draft edit :", quiz);
    this.props.setQuizDraft(quiz);
    this.props.history.push(`/createquiz?qid=${quiz._id}`);
  }

  componentDidMount() {
    // console.log("MyQuizzes Did MOUNT");

    if (!isEmpty(this.props.quizzes.myQuizzes)) {
      // console.log("MyQuizzes from redux");
      this.setState({ quizzes: this.props.quizzes.myQuizzes });
    } else {
      // console.log("MyQuizzes from state");
      axios
        .get("/api/quizzes/getmyquizzes")
        .then(
          function (res) {
            // console.log("getmyquizzes res: ", res.data);
            if (isEmpty(res.data)) {
              this.setState({ quizzes: "Empty" });
            } else {
              this.setState(
                { quizzes: res.data },
                function () {
                  // console.log("res data: ", this.state.quizzes);
                }.bind(this)
              );
            }
          }.bind(this)
        )
        .catch(function (err) {
          console.log("getmyquizzes client err: ", err.response.data);
        });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEmpty(nextProps.quizzes.myQuizzes)) {
      return {
        quizzes: nextProps.quizzes.myQuizzes,
      };
    }

    return null;
  }

  render() {
    const { quizzes, isDeletingQuiz, isEditPostedQuiz, showReviews, quizOfReviews, areYouSureEditPostedQuizVisible } = this.state;
    const { styles } = this.props;

    return (
      <div className="MyQuizzesMainDiv">
        <h1 className="myQuizzesHeader">My quizzes</h1>
        {!isEmpty(quizzes) && typeof quizzes !== "string" && quizzes.length > 0 ? (
          <div className="quizzesBody">
            {!isEmpty(quizzes) &&
            quizzes.length > 0 &&
            !isEmpty(
              quizzes.filter(function (quiz) {
                return quiz.draft === true;
              })
            ) ? (
              <div className="myQuizzesWrapperDiv">
                <h1 className="myQuizzesSubHeader">Drafts</h1>
                <ul className="quizzesUL quizzesULDrafts">
                  {quizzes.map(
                    function (quiz) {
                      if (quiz.draft === true)
                        return (
                          <MyQuiz_Single
                            key={quiz._id}
                            quizType={QUIZ_TYPE_DRAFT}
                            quiz={quiz}
                            limitPeekToFive={this.limitPeekToFive}
                            editQuizDraft={this.editQuizDraft}
                            discardDraft={this.discardDraft}
                            confirmDiscardDraft={this.confirmDiscardDraft}
                            showReviews={this.showReviews}
                          />
                        );
                    }.bind(this)
                  )}
                </ul>
              </div>
            ) : null}
            {!isEmpty(quizzes) &&
            quizzes.length > 0 &&
            !isEmpty(
              quizzes.filter(function (quiz) {
                return quiz.draft !== true;
              })
            ) ? (
              <div className="myQuizzesWrapperDiv">
                <h1 className="myQuizzesSubHeader">Posted quizzes</h1>
                <ul className="quizzesUL">
                  {quizzes.map(
                    function (quiz) {
                      if (quiz.draft !== true || isEmpty(quiz.draft))
                        return (
                          <MyQuiz_Single
                            key={quiz._id}
                            quizType={QUIZ_TYPE_POSTED}
                            quiz={quiz}
                            redirectToQuiz={this.redirectToQuiz}
                            limitPeekToFive={this.limitPeekToFive}
                            editPostedQuiz={this.editPostedQuiz}
                            confirmEditPostedQuiz={this.confirmEditPostedQuiz}
                            showReviews={this.showReviews}
                          />
                        );
                    }.bind(this)
                  )}
                </ul>
              </div>
            ) : null}
            <div className="areYouSureDiscardDraft" ref={this.areYouSureDiscardDraft}>
              <Tilt className="Tilt" tiltMaxAngleX={7} tiltMaxAngleY={7}>
                <div className="confirmDiscardDivWrapper">
                  <div
                    className={classnames("confirmDiscardDiv searchFormDiv createQuizSearchFormDiv", {
                      "confirmDiscardDivExtended": isDeletingQuiz,
                    })}
                  >
                    <h1>Discard draft?</h1>
                    <div className="confirmDiscardBtnsDiv">
                      <button
                        className="submitBtn uploadQuizBtn"
                        onClick={function () {
                          this.discardDraft();
                        }.bind(this)}
                      >
                        Confirm
                      </button>
                      <button
                        className="submitBtn uploadQuizBtn"
                        onClick={function () {
                          this.cancelDiscardDraft();
                        }.bind(this)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div
                      className={classnames("confirmDiscardSpinnerDiv", {
                        "confirmDiscardSpinnerDivVisible": isDeletingQuiz,
                      })}
                    >
                      <SpinnerDelayed isLoading={true} />
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>

            <div
              className={classnames("areYouSureDiscardDraft areYouSureEditPostedQuiz", {
                "areYouSureEditPostedQuizVisible": areYouSureEditPostedQuizVisible,
              })}
              ref={this.areYouSureEditPostedQuiz}
            >
              <Tilt className="Tilt" tiltMaxAngleX={7} tiltMaxAngleY={7}>
                <div className="confirmDiscardDivWrapper confirmEditPostedQuizDivWrapper">
                  <div
                    className={classnames("confirmEditPostedQuizDiv confirmDiscardDiv searchFormDiv createQuizSearchFormDiv", {
                      "confirmEditPostedQuizDivExtended": isEditPostedQuiz,
                    })}
                  >
                    <h1>Edit posted quiz?</h1>
                    <p className="editPostedQuizWarningParagraph">
                      Editing a posted quiz will <span style={{ color: "yellow" }}>delete</span> all its reviews and{" "}
                      <span style={{ color: "yellow" }}>reset</span> its rating! Are you sure?
                    </p>
                    <div className="confirmDiscardBtnsDiv">
                      <button
                        className="submitBtn uploadQuizBtn"
                        onClick={function () {
                          this.editPostedQuiz();
                        }.bind(this)}
                      >
                        Edit
                      </button>
                      <button
                        className="submitBtn uploadQuizBtn"
                        onClick={function () {
                          this.cancelEditPostedQuiz();
                        }.bind(this)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div
                      className={classnames("confirmDiscardSpinnerDiv", {
                        "confirmEditPostedQuizSpinnerDivVisible": isEditPostedQuiz,
                      })}
                    >
                      <SpinnerDelayed isLoading={true} />
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
          </div>
        ) : quizzes === "Empty" ? (
          <div className="borderBoxWrapper">
            <div
              onClick={function (e) {
                this.createQuiz(e);
              }.bind(this)}
              className="borderBox"
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <div className="borderBoxContent">
                <h1>You haven't created any quizzes yet</h1>
                <p>Click this box to create your first one</p>
              </div>
            </div>
          </div>
        ) : (
          // <div className="draftErrorDiv">
          //     <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
          //     <span className="errorSpan draftErrorSpan">You haven't created any quizzes yet</span>
          // </div>
          //  <p>You haven't created any quizzes yet</p>
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

  limitPeekToFive(questions) {
    // console.log("limit: ", questions);
    if (questions.length > 5) {
      return questions.slice(0, 5);
    } else return questions;
  }

  discardDraft() {
    const { discardQuizId, isDeletingQuiz } = this.state;

    this.setState({ isDeletingQuiz: true });

    // console.log("discardQuizId: ", discardQuizId);

    axios
      .delete(`/api/quizzes/deletequiz/${discardQuizId}`)
      .then(
        function (res) {
          console.log("delete quiz res data: ", res.data);
          this.props.getMyQuizzes(res.data);
          this.areYouSureDiscardDraft.current.classList.remove("areYouSureDiscardDraftVisible");
          this.setState({ isDeletingQuiz: false });
        }.bind(this)
      )
      .catch(
        function (err) {
          console.log("Error removing quiz");
          this.setState({ isDeletingQuiz: false });
        }.bind(this)
      );
  }

  cancelDiscardDraft() {
    const { isDeletingQuiz } = this.state;
    this.setState({ isDeletingQuiz: false });
    this.areYouSureDiscardDraft.current.classList.remove("areYouSureDiscardDraftVisible");
  }

  confirmDiscardDraft(discardQuizId) {
    this.setState({ discardQuizId });
    this.areYouSureDiscardDraft.current.classList.add("areYouSureDiscardDraftVisible");
  }

  editPostedQuiz() {
    const { postedQuizId, isEditPostedQuiz } = this.state;

    this.setState({ isEditPostedQuiz: true });

    console.log("postedQuizId: ", postedQuizId);

    const quizId = {
      quizId: postedQuizId,
    };

    axios
      .post("/api/quizzes/editpostedquiz/", quizId)
      .then(
        function (res) {
          this.props.history.push(`/createquiz?qid=${res.data._id}`);
          // this.props.getMyQuizzes(res.data);
          // this.areYouSureEditPostedQuiz.current.classList.remove("areYouSureEditPostedQuizVisible");
          this.setState({ isEditPostedQuiz: false, areYouSureEditPostedQuizVisible: false });
        }.bind(this)
      )
      .catch(
        function (err) {
          console.log("Error removing quiz");
          this.setState({ isEditPostedQuiz: false, areYouSureEditPostedQuizVisible: false });
        }.bind(this)
      );
  }

  cancelEditPostedQuiz() {
    const { isEditPostedQuiz } = this.state;
    this.setState({ areYouSureEditPostedQuizVisible: false, isEditPostedQuiz: false });
    // this.areYouSureEditPostedQuiz.current.classList.remove("areYouSureEditPostedQuizVisible");
  }

  confirmEditPostedQuiz(postedQuizId) {
    this.setState({ postedQuizId, areYouSureEditPostedQuizVisible: true });
    // this.areYouSureEditPostedQuiz.current.classList.add("areYouSureEditPostedQuizVisible");
  }

  redirectToQuiz(id) {
    // console.log("quiz id: ", id);
    this.props.history.push(`/quiz/${id}`);
  }

  createQuiz(e) {
    const { auth } = this.props;
    // console.log("create quiz", auth);
    // console.log("create quiz user id", auth.user.id);
    const quizBody = {
      // quizId = '',
      courseBody: {},
      majorBody: {},
      schoolBody: {},
      quizTerm: {},
      questionsList: [],
      quizCreatorName: auth.user.username,
      quizCreatorId: auth.user.id,
      quizName: "",
      teacherName: "",
    };

    axios
      .post("/api/quizzes/addquizdraft", quizBody)
      .then(
        function (res) {
          console.log("draft created: ", res.data);
          this.props.history.push(`/createquiz?qid=${res.data._id}`);
        }.bind(this)
      )
      .catch(
        function (err) {
          console.log("problem creating draft");
        }.bind(this)
      );
  }
}

MyQuizzes.propTypes = {
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object,
  quizzes: PropTypes.object,
  setQuizDraft: PropTypes.func.isRequired,
  getMyQuizzes: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    requests: state.requests,
    quizzes: state.quizzes,
    styles: state.styles,
  };
}

export default connect(mapStateToProps, { setQuizDraft, getMyQuizzes })(MyQuizzes);

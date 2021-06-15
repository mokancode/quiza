import React, { Component } from "react";
import "./QuizReviews.css";
import QuizReviewItem from "./QuizReviewItem";
import { connect } from "react-redux";
import axios from "axios";
import classnames from "classnames";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/is-empty";
import SpinnerDelayed from "../common/SpinnerDelayed";
import { notifyReviewUpdate } from "../../actions/quizActions";

export class QuizReviewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingQuizzes: null,
      enableRetry: false,
      refreshPage: false,
      reviewText: "",
      enableEditReview: false,
      loadMoreReviews: false,
      reviews: [],
      reviewsDisplay: [],
      // reviews: [
      //     {
      //         date: "2019-04-23T00:00:19.505Z",
      //         displayName: "Tester #3",
      //         review: "abcabca",
      //         userId: "5c3d059d44a84f6f6ce01fd1",
      //         _id: "5cbe55ff8e305000603e86a1",
      //     },
      //     {
      //         date: "2019-04-22T04:12:23.649Z",
      //         displayName: "Tester 22",
      //         review: "First review",
      //         userId: "5c316009e64b503f984d0b47",
      //         _id: "5cbd3f696e4b3118a4a997b4",
      //     },
      //     {
      //         date: "2019-04-22T04:12:23.649Z",
      //         displayName: "Tester 22",
      //         review: "First review",
      //         userId: "5c316009e64b503f984d0b47",
      //         _id: "5cbd3f696e4b3118a4a997b4",
      //     },
      //     {
      //         date: "2019-04-22T04:12:23.649Z",
      //         displayName: "Tester 22",
      //         review: "First review",
      //         userId: "5c316009e64b503f984d0b47",
      //         _id: "5cbd3f696e4b3118a4a997b4",
      //     },
      //     {
      //         date: "2019-04-22T04:12:23.649Z",
      //         displayName: "Tester 22",
      //         review: "First review",
      //         userId: "5c316009e64b503f984d0b47",
      //         _id: "5cbd3f696e4b3118a4a997b4",
      //     },
      //     {
      //         date: "2019-04-22T04:12:23.649Z",
      //         displayName: "Tester 22",
      //         review: "First review",
      //         userId: "5c316009e64b503f984d0b47",
      //         _id: "5cbd3f696e4b3118a4a997b4",
      //     },
      //     {
      //         date: "2019-04-22T04:12:23.649Z",
      //         displayName: "Tester 22",
      //         review: "First review",
      //         userId: "5c316009e64b503f984d0b47",
      //         _id: "5cbd3f696e4b3118a4a997b4",
      //     },
      // ]
    };

    this.showReviews = this.props.showReviews;
    this.retryConnect = this.retryConnect.bind(this);
    this.questionOnChangeKeyDown = this.questionOnChangeKeyDown.bind(this);
    this.questionOnChange = this.questionOnChange.bind(this);
    this.onPasteHandler = this.onPasteHandler.bind(this);
    this.loadMoreReviews = this.loadMoreReviews.bind(this);
    this.updateMyReview = this.updateMyReview.bind(this);
    this.onChangeReviewText = this.onChangeReviewText.bind(this);

    // refs
    this.reviewsListUL = React.createRef();
  }

  componentDidMount() {
    this.setState({ enableRetry: false, loadingQuizzes: true });

    window.addEventListener(
      "keydown",
      function (e) {
        // e.preventDefault();
        if (e.keyCode === 27) {
          this.showReviews(false);
        }
      }.bind(this)
    );

    const { reviews, rating } = this.props.quiz;
    const { auth } = this.props;

    // const { reviews } = this.state;
    // const allReviewsExceptMine = reviews.filter(function (review) {
    //     return review.userId.toString() != auth.user.id;
    // });

    // this.setState({ reviewsDisplay: allReviewsExceptMine.slice(0, 1), moreReviewsAvailable: true });

    // return;
    axios
      .post("api/quizzes/getreviewusers", { reviews })
      .then(
        function (res) {
          if (isEmpty(res.data)) return this.setState({ reviews: null, loadingQuizzes: false });

          const allReviewsExceptMine = res.data.filter(function (review) {
            return review.userId.toString() != auth.user.id;
          });

          var myRating,
            myReview = res.data.filter(function (review) {
              return review.userId.toString() === auth.user.id;
            });

          if (!isEmpty(myReview)) {
            myReview = myReview[0];
            myRating = rating.ratingArray.filter(function (rating) {
              return rating.userId.toString() === auth.user.id;
            });
          }

          this.setState(
            {
              loadingQuizzes: false,
              reviews: allReviewsExceptMine,
              reviewsDisplay: allReviewsExceptMine.slice(0, 15),
              // reviewsDisplay: allReviewsExceptMine.slice(0, 1),
              myReview,
              myRating,
            },
            function () {
              if (this.state.reviews > this.state.reviewsDisplay) {
                this.setState({ moreReviewsAvailable: true });
              }
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(function (err) {});

    setTimeout(
      function () {
        this.setState({ enableRetry: true });
      }.bind(this),
      5000
    );
  }

  onKeyDown(e) {}

  retryConnect(e) {
    const { reviews } = this.props.quiz;

    this.setState(
      { loadingQuizzes: true },
      function () {
        if (isEmpty(reviews)) {
          return this.setState({ refreshPage: true });
        }

        axios
          .post("api/quizzes/getreviewusers", { reviews })
          .then(
            function (res) {
              this.setState({ reviews: res.data, loadingQuizzes: false });
            }.bind(this)
          )
          .catch(function (err) {});
      }.bind(this)
    );
  }

  reloadPage(e) {
    // e.preventDefault();
    window.location.reload();
  }

  loadMoreReviews(e) {
    var { reviews, reviewsDisplay } = this.state;

    var newLength = reviews.slice(0, reviewsDisplay.length + 15).length;
    // var newLength = reviews.slice(0, reviewsDisplay.length + 1).length;

    if (!(reviews.length > newLength)) {
      this.setState({ moreReviewsAvailable: false });
    }

    if (reviews.length > reviewsDisplay.length) {
      this.setState(
        { reviewsDisplay: reviews.slice(0, newLength) },
        function () {
          try {
            // var restOfArray = this.reviewsListUL.current.childNodes[1].childNodes[0];
            // var lastElementIndex = newLength - 1;
            // var element = restOfArray.childNodes[lastElementIndex];
            // console.log("elt: ", element.offsetTop);
            // // // element.scrollTop = element.scrollHeight - element.clientHeight;
            // // // document.documentElement.scrollTop = document.documentElement.scrollHeight;
            // setTimeout(function () {
            //     window.scroll({
            //         behavior: 'smooth',
            //         left: 0,
            //         // top: document.documentElement.scrollHeight
            //         top: element.offsetTop
            //     });
            // }, 100);
          } catch (err) {
            // console.log("scroll error: ", err);
          }
        }.bind(this)
      );
    }
  }

  onChangeReviewText(e) {
    // console.log("review text: ", e.target.value);
    this.setState({ updatedReviewText: e.target.value });
  }

  async updateMyReview(operationType) {
    const { quiz } = this.props;

    var reviewData = {};
    if (operationType === "delete") {
      this.setState({ myReview: null }, function () {
        const { reviews } = this.state;
        if (isEmpty(reviews)) this.setState({ reviews: null });
      });
      reviewData = {
        quizId: quiz._id,
        reviewText: null,
        operationType,
      };
    } else if (operationType === "update") {
      this.setState({ isUpdatingReview: true });
      const { updatedReviewText, stars } = this.state;

      reviewData = {
        quizId: quiz._id,
        reviewText: updatedReviewText,
        operationType,
      };
    }

    const { stars } = this.state;
    if (!isEmpty(stars) && operationType === "update") {
      const rateData = {
        quizId: quiz._id,
        quizRating: stars,
        isUpdate: true,
      };

      var newRating;
      await axios
        .post("/api/quizzes/ratequiz", rateData)
        .then(async (res) => {
          // console.log("quiz rate successful: ", res);
          newRating = res.data;
        })
        .catch(
          function (err) {
            console.log("quiz rate error:", err.response.data);
            this.setState({ errors: err.response.data });
          }.bind(this)
        );
    }

    return new Promise((resolve, reject) => {
      axios
        .post("/api/quizzes/addquizreview", reviewData)
        .then(
          function (res) {
            // console.log("review updated", res);
            this.props.notifyReviewUpdate(operationType);
            // this.props.history.push(`/createquiz?qid=${res.data._id}`);
            this.setState({ isUpdatingReview: false });
            resolve({ newReview: res.data, newRating });
          }.bind(this)
        )
        .catch(
          function (err) {
            this.setState({ isUpdatingReview: false });
            console.log("error updating review", err.response.data);
            reject("failed promise");
          }.bind(this)
        );
    });
  }

  setStar = (stars) => {
    this.setState({ stars });
  };

  render() {
    const { quiz } = this.props;
    const {
      myReview,
      reviews,
      reviewsDisplay,
      enableRetry,
      refreshPage,
      moreReviewsAvailable,
      reviewText,
      notEnoughSpace,
      isLoading,
      reviewUploaded,
      enableEditReview,
      updatedReviewText,
      stars,
    } = this.state;

    return (
      <div className="reviewsListDivWrapper" onKeyDown={this.onKeyDown}>
        <div className="reviewsListDiv">
          <button
            onClick={function () {
              this.showReviews(false, undefined);
            }.bind(this)}
            className="closeHelpBtn closeReviewsBtn"
          >
            X
          </button>
          <div className="quizNameReviewsHeaderDiv">
            <h1
              className={classnames("quizNameReviewsHeader", {
                "quizNameReviewsHeaderVisible": !isEmpty(reviews),
              })}
            >
              {quiz.name} <span>reviews</span>
            </h1>
            {/* 
                        <div className="reviewHeaderWrapper">
                            <h1 className={classnames("secondReviewHeader", {
                                "quizNameReviewsHeaderVisible": !isEmpty(reviews)
                            })}>{quiz.name}</h1>
                        </div> */}
          </div>
          <ul className="reviewsListUL" ref={this.reviewsListUL}>
            {!isEmpty(myReview) && enableEditReview === false ? (
              <QuizReviewItem
                quiz={quiz}
                review={myReview}
                editableReview={true}
                onChangeReviewText={this.onChangeReviewText}
                updateMyReview={this.updateMyReview}
                isUpdatingReview={this.state.isUpdatingReview}
                updatedReviewText={updatedReviewText}
                setStar={this.setStar}
                stars={stars}
              />
            ) : !isEmpty(myReview) && enableEditReview === true ? (
              <div className="takeQuizReviewDivWrapper">
                <form className="takeQuizReviewDiv editQuiz" onSubmit={this.submitReview}>
                  <p className="editQuizHeader">Edit your quiz</p>

                  <div
                    // ref={this.editableDivRef}
                    // onChange={this.onChange}
                    onKeyUp={function (e) {
                      this.questionOnChange(e);
                    }.bind(this)}
                    onKeyDown={function (e) {
                      this.questionOnChangeKeyDown(e);
                    }.bind(this)}
                    // onFocus={this.questionInputOnFocus}
                    // onBlur={this.questionInputOnBlur}
                    name="reviewText"
                    onPaste={function (e) {
                      this.onPasteHandler(e);
                    }.bind(this)}
                    className="createQuizQuestionTextDiv inputQuestionText reviewInput editReviewInput"
                    // contentEditable="plaintext-only
                    contentEditable="true"
                  >
                    {/* {isEmpty(question.question) ?  */}
                    {/* <span className="placeholderSpan">Question text here</span> */}
                    {/* : null} */}
                  </div>

                  <div className="questioInputErrorsDiv takeQuizQuestioInputErrorsDiv">
                    {500 - reviewText.length <= 100 ? (
                      <span className="questionLengthCountLeft editReviewQuestionLengthCountLeft">
                        {500 - reviewText.length} characters left
                      </span>
                    ) : null}

                    {notEnoughSpace ? <span className="questionLengthCountLeft notEnoughSpace">Not enough space to paste</span> : null}
                  </div>

                  {reviewText.length > 0 ? (
                    <button
                      className={classnames("submitBtn takeQuizSubmitReviewBtn editReviewSubmit", {
                        "uploadQuizBtnLoading": isLoading === true,
                      })}
                      onClick={this.submitReview}
                      disabled={isLoading}
                    >
                      Submit
                    </button>
                  ) : null}
                  {reviewUploaded ? (
                    <div className="settingsSavedWrapper">
                      <span className="errorSpan registerErrorSpan settingsSaved">Success!</span>
                    </div>
                  ) : null}
                </form>
              </div>
            ) : null}
            {
              // false ?
              // !isEmpty(reviews) && reviews.length > 0 ?
              !isEmpty(reviewsDisplay) && reviewsDisplay.length > 0 ? (
                <div className="restOfReviewsDiv">
                  <ul className="restOfReviewsUL">
                    {reviewsDisplay.map(
                      function (review) {
                        return (
                          <QuizReviewItem
                            key={review._id}
                            quiz={quiz}
                            review={review}
                            onChangeReviewText={this.onChangeReviewText}
                            updateMyReview={this.updateMyReview}
                            isUpdatingReview={this.state.isUpdatingReview}
                          />
                        );
                      }.bind(this)
                    )}
                  </ul>
                  {moreReviewsAvailable === true && reviews.length > reviewsDisplay.length ? (
                    <button onClick={this.loadMoreReviews} className="submitBtn loadMoreQuizzes loadMoreReviews">
                      Load more
                    </button>
                  ) : null}
                </div>
              ) : // : isEmpty(reviews) ?
              reviews === null ? (
                <div className="settingsSavedWrapper">
                  <span className="errorSpan registerErrorSpan reloadPageSpan noReviewsYet">No reviews yet</span>
                </div>
              ) : null
            }

            {!isEmpty(reviews) && isEmpty(reviewsDisplay) ? (
              <div className="loadingQuizzesDiv loadingReviewsDiv">
                <p className="loadingQuizzesParagraph loadingReviewsParagraph">Loading reviews...</p>
                <div className="spinnerDivQuizzes spinnerDivReviews">
                  <SpinnerDelayed isLoading={true} />
                </div>
                {enableRetry === true && refreshPage === false ? (
                  <button onClick={this.retryConnect} className="chooseQuizBtn retryBtn">
                    Retry
                  </button>
                ) : null}
                {refreshPage === true ? (
                  <div className="settingsSavedWrapper">
                    <span
                      className="errorSpan registerErrorSpan reloadPageSpan"
                      onClick={function (e) {
                        this.reloadPage(e);
                      }.bind(this)}
                    >
                      Please reload the page.
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }

  questionOnChange(e) {
    var questionRef = e.target;
    // this if statement below is only applicable to a contentEditable div (and not the textarea)
    if (e.target.innerHTML.length > 500) {
      try {
        var sel = window.getSelection();
        sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
        e.preventDefault();
        return;
      } catch (err) {
        // console.log("err");
      }
    }

    this.setState({ reviewText: e.target.innerHTML }); // this is for contentEditable div

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

    if (e.target.innerHTML.length >= 500) {
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

    if (e.clipboardData.getData("Text").length + e.target.innerHTML.length > 500) {
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
}

QuizReviewsList.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = function (state) {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { notifyReviewUpdate })(QuizReviewsList);

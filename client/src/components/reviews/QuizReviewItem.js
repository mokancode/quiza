import React, { Component, Fragment } from "react";
import StarDisplay from "../quizzes/StarDisplay";
import classnames from "classnames";
import isEmpty from "../../validation/is-empty";
import moment from "moment";
import SpinnerDelayed from "../common/SpinnerDelayed";
import Star from "../quizzes/Star";

export class QuizReviewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: "",
    };

    this.onChangeReviewText = this.props.onChangeReviewText;
    this.updateMyReview = this.props.updateMyReview;
    this.setStar = this.props.setStar;

    // refs
    this.reviewEditInputRef = React.createRef();
  }

  componentDidMount() {
    const { quiz, review } = this.props;
    this.setState({ review, displayName: review.displayName });

    try {
      var rating = quiz.rating.ratingArray.filter(function (ratingItem) {
        // console.log("ratingItem userId: ", ratingItem.userId.toString());
        // console.log("review userId: ", review.userId.toString());

        return ratingItem.userId.toString() === review.userId.toString();
      })[0].rate;
      // console.log("Rating", rating);
    } catch (error) {
      console.log("Rating err", error);
    }

    if (!isEmpty(rating)) this.setState({ rating });
  }

  render() {
    const { editableReview, isUpdatingReview, updatedReviewText, stars } = this.props;
    const { review, rating, editQuizEnable, displayName, updateError } = this.state;

    return (
      <li
        className={classnames("quizReviewListItem", {
          "quizReviewListItemMyReview": editableReview === true,
        })}
      >
        {/* {editableReview === true ?
                    <div className="myReviewBtnDivWrapper">
                        <div className="myReviewBtnDiv editMyReviewBtnDiv">
                            <img className="editReviewIcon" src="./images/pencil-edit-button.svg" alt="Edit"></img>
                            <button className="myReviewBtn editQuizReviewBtn">Edit</button>
                        </div>
                        <div className="myReviewBtnDiv deleteMyReviewBtnDiv">
                            <img className="deleteReviewIcon" src="./images/rubbish-bin.svg" alt="Delete"></img>
                            <button className="myReviewBtn deleteQuizReviewBtn">Delete</button>
                        </div>
                    </div>
                    : null
                } */}

        {review ? (
          <div className="starsAndBtnsRow">
            <div
              className={classnames("quizzesAllStarsContainer", {
                "": false,
              })}
            >
              <div className="starsInnerContainer">
                {editQuizEnable ? (
                  <div className={"editableStars"}>
                    <Star
                      starFullString="starOne"
                      starFullNum={1}
                      starHalfString="starZeroHalf"
                      starHalfNum={0.5}
                      stars={!isEmpty(stars) ? stars : rating}
                      setStar={this.setStar}
                    />
                    <Star
                      starFullString="starTwo"
                      starFullNum={2}
                      starHalfString="starOneHalf"
                      starHalfNum={1.5}
                      stars={!isEmpty(stars) ? stars : rating}
                      setStar={this.setStar}
                    />
                    <Star
                      starFullString="starThree"
                      starFullNum={3}
                      starHalfString="starTwoHalf"
                      starHalfNum={2.5}
                      stars={!isEmpty(stars) ? stars : rating}
                      setStar={this.setStar}
                    />
                    <Star
                      starFullString="starFour"
                      starFullNum={4}
                      starHalfString="starThreeHalf"
                      starHalfNum={3.5}
                      stars={!isEmpty(stars) ? stars : rating}
                      setStar={this.setStar}
                    />
                    <Star
                      starFullString="starFive"
                      starFullNum={5}
                      starHalfString="starFourHalf"
                      starHalfNum={4.5}
                      stars={!isEmpty(stars) ? stars : rating}
                      setStar={this.setStar}
                    />
                  </div>
                ) : (
                  <Fragment>
                    <StarDisplay starFullString="starOne" starFullNum={1} starHalfString="starZeroHalf" starHalfNum={0.5} rating={rating} />
                    <StarDisplay starFullString="starTwo" starFullNum={2} starHalfString="starOneHalf" starHalfNum={1.5} rating={rating} />
                    <StarDisplay
                      starFullString="starThree"
                      starFullNum={3}
                      starHalfString="starTwoHalf"
                      starHalfNum={2.5}
                      rating={rating}
                    />
                    <StarDisplay
                      starFullString="starFour"
                      starFullNum={4}
                      starHalfString="starThreeHalf"
                      starHalfNum={3.5}
                      rating={rating}
                    />
                    <StarDisplay
                      starFullString="starFive"
                      starFullNum={5}
                      starHalfString="starFourHalf"
                      starHalfNum={4.5}
                      rating={rating}
                    />
                  </Fragment>
                )}

                <p className="reviewAuthor">{`${displayName}`}</p>
              </div>
              <div className="reviewAuthorAndDates">
                <p className="reviewAuthor reviewAuthorMobile">{`${displayName}`}</p>
                <div className="reviewDates">
                  {/* <span>{`${moment(review.date).format("MMM Do, YYYY h:mmA")}`}</span> */}
                  <span>{`${moment(review.date).format("MM/D/YYYY")}`}</span>
                  {/* {review.lastEdited ? <span className="reviewLastEditedSpan">{` Last edited ${moment(review.lastEdited).format("MMM Do, YYYY h:mmA")}`}</span> : null} */}
                  {review.lastEdited ? <span className="reviewLastEditedSpan">{`(edited)`}</span> : null}
                </div>
              </div>
            </div>

            {editableReview === true ? (
              <div className="myReviewBtnDivWrapper">
                <div className="myReviewBtnDiv editMyReviewBtnDiv">
                  <img className="editReviewIcon" src="./images/pencil-edit-button.svg" alt="Edit"></img>
                  {editQuizEnable ? (
                    <button
                      onClick={function (e) {
                        this.setState({ editQuizEnable: false });
                      }.bind(this)}
                      className="myReviewBtn editQuizReviewBtn"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={function (e) {
                        this.setState(
                          { editQuizEnable: true },
                          function () {
                            this.reviewEditInputRef.current.focus();
                          }.bind(this)
                        );
                      }.bind(this)}
                      className="myReviewBtn editQuizReviewBtn"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="myReviewBtnDiv deleteMyReviewBtnDiv">
                  <img className="deleteReviewIcon" src="./images/rubbish-bin.svg" alt="Delete"></img>
                  <button
                    className="myReviewBtn deleteQuizReviewBtn"
                    onClick={function (e) {
                      const { _id } = this.state.review;
                      var removeReviewFunc = this.updateMyReview("delete");
                      var mPromise = function () {
                        removeReviewFunc
                          .then(
                            function (fulfilled) {
                              // console.log("promise success: ", fulfilled);
                              this.setState({ editQuizEnable: false, review: null });
                            }.bind(this)
                          )
                          .catch(function (error) {
                            // console.log("promise error: ", error);
                          });
                      }.bind(this);
                      mPromise();
                    }.bind(this)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {!isEmpty(review) && editQuizEnable ? (
          <div className="editReviewDiv">
            <textarea
              ref={this.reviewEditInputRef}
              defaultValue={review.review}
              onChange={function (e) {
                this.onChangeReviewText(e);
              }.bind(this)}
              type="text"
            ></textarea>
            <button
              onClick={async function (e) {
                this.setState({ updateError: false });
                if (isEmpty(updatedReviewText) || updatedReviewText === review.review) return;

                var updateReviewFunc = this.updateMyReview("update");

                var mPromise = function () {
                  updateReviewFunc
                    .then(
                      function (fulfilled) {
                        // console.log("promise success: ", fulfilled);

                        const { displayName } = this.state.review;
                        var newReviewObj = Object.assign({}, fulfilled);
                        // console.log("newReviewObj: ", newReviewObj);
                        newReviewObj.displayName = displayName;

                        // once the promise returns success, the review text should change to the new text.
                        // console.log("newReviewObj", newReviewObj);

                        this.setState({
                          editQuizEnable: false,
                          review: newReviewObj.newReview,
                          rating: !isEmpty(newReviewObj.newRating) ? newReviewObj.newRating : this.state.rating,
                        });
                      }.bind(this)
                    )
                    .catch((error) => {
                      this.setState({ updateError: true });
                      console.log("review edit promise error: ", error);
                    });
                }.bind(this);
                mPromise();
              }.bind(this)}
            >
              Done
            </button>
            <SpinnerDelayed isLoading={isUpdatingReview} />
          </div>
        ) : !isEmpty(review) ? (
          review.review.split("\n").map(function (line, index) {
            return (
              <div key={review._id + `line${index}`}>
                <p className="reviewContent">{line}</p>
                <p className="newLine"></p>
              </div>
            );
          })
        ) : null}

        {updateError && <p id={"updateError"}>Error: Edit failed</p>}
      </li>
    );
  }
}

export default QuizReviewItem;

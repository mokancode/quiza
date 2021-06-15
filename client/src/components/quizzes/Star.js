import React, { Component } from "react";
import classnames from "classnames";
import './Star.css';

export class Star extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { starFullNum, starHalfNum, stars, setStar } = this.props;
    return (
      <div className="starContainer">
        <img
          src={"/images/ratingStars/fullStar.png"}
          className={classnames("ratingStar fullRatingStar", {
            "show": starFullNum <= stars,
          })}
        ></img>
        <img
          src={"/images/ratingStars/halfStar.png"}
          className={classnames("ratingStar halfRatingStar", {
            "show": starHalfNum <= stars,
          })}
        ></img>
        <img
          src={"/images/ratingStars/emptyStar.png"}
          className={classnames("ratingStar emptyRatingStar", {
            "show": stars <= starHalfNum,
          })}
        ></img>

        <div
          className="leftHalf"
          onMouseEnter={function () {
            setStar(starHalfNum);
          }.bind(this)}
        ></div>
        <div
          className="rightHalf"
          onMouseEnter={function () {
            setStar(starFullNum);
          }.bind(this)}
        ></div>
      </div>
    );
  }
}

export default Star;

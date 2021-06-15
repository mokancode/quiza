import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

export class StarDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { starFullNum, starHalfNum, rating } = this.props;
    return (
      <div className="starContainer starDisplayContainer">
        {starFullNum <= rating ? (
          <img src={"images/ratingStars/fullStar.png"} className="ratingStar fullRatingStar"></img>
        ) : starHalfNum <= rating ? (
          <img src={"images/ratingStars/halfStar.png"} className="ratingStar halfRatingStar"></img>
        ) : (
          <img src={"images/ratingStars/emptyStar.png"} className="ratingStar emptyRatingStar"></img>
        )}
      </div>
    );
  }
}

export default StarDisplay;

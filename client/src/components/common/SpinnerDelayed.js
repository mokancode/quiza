import React, { Component } from "react";
import "./SpinnerDelayed.css";
import classnames from "classnames";

export class SpinnerDelayed extends Component {
  render() {
    const { isLoading } = this.props;

    return (
      <div
        className={classnames("spinnerDelayedDiv", {
          "spinnerDelayedDivShow": isLoading,
          // "spinnerDelayedDivShow": true
        })}
      >
        <span className="rotator"></span>
        <span className="rotator"></span>
        <span className="rotator"></span>
        <span className="rotator"></span>
      </div>
    );
  }
}

export default SpinnerDelayed;

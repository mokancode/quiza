import React, { Component } from "react";
import classnames from "classnames";
import Lottie from "react-lottie";
import "./EyeSquint.css";
import data from "./eyeSquint.json";

export class EyeSquint extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastTimeoutId: null,
      direction: 1,
      stop: true,
    };
  }

  render() {
    const { direction } = this.state;
    const { stop } = this.props;

    const defaultOptions = {
      loop: false,
      autoplay: false,
      iterations: 2,
      animationData: data,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <div
        className={classnames("eyeSquintDiv", {
          "eyeSquintDivHide": stop,
        })}
      >
        <div className="eyeSquintLottieDiv">
          <Lottie
            options={defaultOptions}
            // direction={direction}
            // height={400}
            // width={400}
            isStopped={stop}
            // isPaused={pause}
            // isPaused={this.state.isPaused}
          />
        </div>
      </div>
    );
  }
}

export default EyeSquint;

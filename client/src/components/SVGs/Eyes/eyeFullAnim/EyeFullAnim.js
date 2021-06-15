import React, { Component } from "react";
import classnames from "classnames";
import Lottie from "react-lottie";
import "./EyeFullAnim.css";
import data from "./eyeFullAnim.json";
// import anime from 'animejs';

export class EyeFullAnim extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastTimeoutId: null,
      direction: 1,
      stop: true,
      eyeStatus: 1,
    };

    this.resetModeHasUpdatedFunc = this.props.resetModeHasUpdatedFunc;

    // refs
    this.lottieRef = React.createRef();
  }

  componentDidMount() {
    // this.lottieRef.current.play();
    // this.lottieRef.current.anim.setSpeed(0.5);
    // this.lottieRef.current.anim.goToAndPlay(130, false);
    // this.lottieRef.current.goTo(30, false);

    var { mode } = this.props;

    switch (mode) {
      case 1:
        // this.setState({ eyeOpenState: true });
        this.lottieRef.current.anim.playSegments([[1, 0]], true);
        break;
      case 2:
        // this.setState({ eyeSquintState: true });
        this.lottieRef.current.anim.playSegments([[0, 15]], true);
        break;
      case 3:
        // this.setState({ eyeShutState: true });
        this.lottieRef.current.anim.playSegments([[0, 33]], true);
        break;
    }
  }

  componentDidUpdate() {
    const { eyeOpen, eyeSquint, eyeShut, mode, modeHasUpdated } = this.props;
    const { eyeOpenState, eyeSquintState, eyeShutState } = this.state;

    if (eyeOpen && !eyeOpenState) {
      if (eyeSquintState || mode === 2) {
        // console.log("leaving squint");
        this.lottieRef.current.anim.playSegments(
          [
            [15, 14],
            [14, 0],
          ],
          true
        );
      } else if (eyeShutState || mode === 3) {
        // console.log("leaving shut");
        this.lottieRef.current.anim.playSegments(
          [
            [33, 32],
            [32, 0],
          ],
          true
        );
      } else if (mode === 1) this.lottieRef.current.anim.playSegments([[0, 1]], true);

      // console.log("entering open");
      this.setState({ eyeOpenState: true, eyeSquintState: false, eyeShutState: false });
    } else if (eyeSquint && !eyeSquintState) {
      if ((eyeShutState || mode === 3) && !eyeOpenState) {
        // console.log("leaving shut");
        this.lottieRef.current.anim.playSegments(
          [
            [33, 32],
            [32, 15],
          ],
          true
        );
      } else if (eyeOpenState || mode === 1) {
        // console.log("leaving open");
        this.lottieRef.current.anim.playSegments([[0, 15]], true);
      } else if (mode === 2) this.lottieRef.current.anim.playSegments([[14, 15]], true);

      // console.log("entering squint");
      this.setState({ eyeSquintState: true, eyeOpenState: false, eyeShutState: false });
    } else if (eyeShut && !eyeShutState) {
      if (eyeSquintState || mode === 2) {
        // console.log("leaving squint");
        this.lottieRef.current.anim.playSegments([[15, 33]], true);
      } else if (eyeOpenState || mode === 1) {
        // console.log("leaving open");
        this.lottieRef.current.anim.playSegments(
          [
            [0, 14],
            [15, 33],
          ],
          true
        );
      }

      // else if (mode === 3) {
      //     this.lottieRef.current.anim.playSegments([[32, 33]], true);
      // }

      // console.log("entering shut");
      this.setState({ eyeSquintState: false, eyeOpenState: false, eyeShutState: true });
    }

    if (!eyeOpen && !eyeSquint && !eyeShut && (eyeOpenState || eyeSquintState || eyeShutState)) {
      // console.log("leaving all")

      if (mode === 1) {
        if (eyeShutState)
          this.lottieRef.current.anim.playSegments(
            [
              [34, 15],
              [14, 0],
            ],
            true
          );
        else if (eyeSquintState)
          this.lottieRef.current.anim.playSegments(
            [
              [15, 14],
              [14, 0],
            ],
            true
          );
        else if (eyeOpenState) this.lottieRef.current.anim.playSegments([[0, 1]], true);
      }

      if (mode === 2) {
        if (eyeShutState)
          this.lottieRef.current.anim.playSegments(
            [
              [34, 33],
              [33, 15],
            ],
            true
          );
        else if (eyeSquintState) this.lottieRef.current.anim.playSegments([[14, 15]], true);
        else if (eyeOpenState) this.lottieRef.current.anim.playSegments([[0, 15]], true);
      }

      if (mode === 3) {
        if (eyeOpenState) {
          this.lottieRef.current.anim.playSegments(
            [
              [0, 14],
              [15, 33],
            ],
            true
          );
        } else if (eyeSquintState) this.lottieRef.current.anim.playSegments([[15, 33]], true);
      }

      this.setState({ eyeSquintState: false, eyeOpenState: false, eyeShutState: false });
    }

    if (modeHasUpdated) {
      if (mode === 1) this.lottieRef.current.anim.playSegments([[0, 1]], true);
      else if (mode === 2) this.lottieRef.current.anim.playSegments([[14, 15]], true);
      else if (mode === 3) this.lottieRef.current.anim.playSegments([[32, 33]], true);

      this.resetModeHasUpdatedFunc();
    }

    const { eyeVisible } = this.props;
    // if (eyeVisible) console.log("eyeVisible");
  }

  render() {
    const { direction, stop } = this.state;
    const { eyeVisible } = this.props;

    const defaultOptions = {
      loop: false,
      autoplay: false,
      animationData: data,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <div
        className={classnames("eyeFullAnimDiv", {
          "eyeFullAnimDivHide": stop,
          "eyeVisible": eyeVisible,
        })}
      >
        <div className="eyeFullAnimLottieDiv">
          <Lottie
            ref={this.lottieRef}
            options={defaultOptions}
            // direction={direction}
            // height={400}
            // width={400}
            // isStopped={stop}
            // isPaused={pause}
            // isPaused={this.state.isPaused}
          />
        </div>
      </div>
    );
  }
}

export default EyeFullAnim;

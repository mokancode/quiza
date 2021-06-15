import React, { Component } from "react";
import "./TripleButton.css";
import classnames from "classnames";
import axios from "axios";
import SpinnerDelayed from "../common/SpinnerDelayed";
import EyeOpen from "../SVGs/Eyes/eyeOpen/EyeOpen";
import EyeSquint from "../SVGs/Eyes/eyeSquint/EyeSquint";
import EyeShut from "../SVGs/Eyes/eyeShut/EyeShut";
import TripleButtonSingle from "./TripleButtonSingle";
import EyeFullAnim from "../SVGs/Eyes/eyeFullAnim/EyeFullAnim";
import isEmpty from "../../validation/is-empty";

export class TripleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      mode: undefined,
      stop: true,
      eyeVisible: null,
    };

    this.changeMode = this.changeMode.bind(this);
    this.resetModeHasUpdatedFunc = this.resetModeHasUpdatedFunc.bind(this);
  }

  componentDidMount() {
    const { isPrivate, isHidden } = this.props;
    if (isPrivate) this.setState({ mode: 2 });
    else if (isHidden) this.setState({ mode: 3 });
    else this.setState({ mode: 1 });
  }

  changeMode(mode) {
    // 1 = accessible to all
    // 2 = accessible only to those with the searchable unique quiz ID
    // 3 = accessible only to the creator

    const modeState = this.state.mode;
    if (Number(modeState) === Number(mode)) return;

    const { eyeOpen, eyeSquint, eyeShut, eyeVisible } = this.state;

    const { quizId } = this.props;

    var quizBody = {
      quizId: quizId,
      mode,
    };

    this.setState({ isLoading: true });

    axios
      .post("/api/quizzes/setquizaccessibility", quizBody)
      .then(
        function (res) {
          if (res.data === "success") {
            this.setState({ mode: Number(mode), isLoading: false, modeHasUpdated: true });
            if (!eyeOpen && !eyeSquint && !eyeShut && !eyeVisible) {
              this.setState({ eyeVisible: true });
            }
          }
        }.bind(this)
      )
      .catch(function (err) {
        console.log("setquizaccessibility error: ", err.response.data);
      });
  }

  resetModeHasUpdatedFunc() {
    this.setState({ modeHasUpdated: false });
  }

  render() {
    const { mode, isLoading, eyeOpen, eyeSquint, eyeShut, modeHasUpdated, eyeVisible } = this.state;

    return (
      <div className="btnCreationDiv">
        <div className="threeBtnDiv">
          {/* <TripleButtonSingle changeMode={this.changeMode} quizExtraClass={"quizPublicBtnDiv"} valueNum={1} labelName="Public" /> */}

          <div
            className="quizAccesibilityBtn quizPublicBtnDiv"
            onMouseEnter={function (e) {
              this.setState({ eyeOpen: true, eyeVisible: true });
            }.bind(this)}
            onMouseLeave={function (e) {
              this.setState({ eyeOpen: false, eyeVisible: false });
            }.bind(this)}
          >
            <label>
              <input
                onChange={function (e) {
                  this.changeMode(e.target.value);
                }.bind(this)}
                type="radio"
                name="quizVisibility"
                value="1"
              />
              Public
            </label>
            {/* <EyeOpen stop={stop} /> */}
          </div>

          {/* <TripleButtonSingle changeMode={this.changeMode} quizExtraClass={"quizPrivateBtnDiv"} valueNum={2} labelName="Private" /> */}

          <div
            className="quizAccesibilityBtn quizPrivateBtnDiv"
            onMouseEnter={function (e) {
              this.setState({ eyeSquint: true, eyeVisible: true });
            }.bind(this)}
            onMouseLeave={function (e) {
              this.setState({ eyeSquint: false, eyeVisible: false });
            }.bind(this)}
          >
            <label>
              <input
                onChange={function (e) {
                  this.changeMode(e.target.value);
                }.bind(this)}
                type="radio"
                name="quizVisibility"
                value="2"
              />
              Private
            </label>
            {/* <EyeSquint stop={stop} /> */}
          </div>

          {/* <TripleButtonSingle changeMode={this.changeMode} quizExtraClass={"quizHiddenBtnDiv"} valueNum={3} labelName="Hidden" /> */}

          <div
            className="quizAccesibilityBtn quizHiddenBtnDiv"
            onMouseEnter={function (e) {
              this.setState({ eyeShut: true, eyeVisible: true });
            }.bind(this)}
            onMouseLeave={function (e) {
              this.setState({ eyeShut: false, eyeVisible: false });
            }.bind(this)}
          >
            <label>
              <input
                onChange={function (e) {
                  this.changeMode(e.target.value);
                }.bind(this)}
                type="radio"
                name="quizVisibility"
                value="3"
              />
              Hidden
            </label>
            {/* <EyeShut stop={stop} /> */}
          </div>

          <span
            className={classnames("glassSlider", {
              "glassSliderDefault": mode === 1,
              "glassSliderPushedOneThird": mode === 2,
              "glassSliderPushedTwoThirds": mode === 3,
            })}
          ></span>
        </div>

        {!isEmpty(mode) ? (
          <EyeFullAnim
            eyeVisible={eyeVisible}
            eyeOpen={eyeOpen}
            eyeSquint={eyeSquint}
            eyeShut={eyeShut}
            mode={mode}
            modeHasUpdated={modeHasUpdated}
            resetModeHasUpdatedFunc={this.resetModeHasUpdatedFunc}
          />
        ) : null}

        <div className="spinnerAndModeText">
          <SpinnerDelayed isLoading={isLoading} />
          <p
            className={classnames("modeText", {
              "modeTextPublic": mode === 1 && isLoading === false,
              "modeTextPrivate": mode === 2 && isLoading === false,
              "modeTextHidden": mode === 3 && isLoading === false,
            })}
          ></p>
        </div>
      </div>
    );
  }
}

export default TripleButton;

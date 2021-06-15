import React, { Component } from "react";
import { connect } from "react-redux";
import { addInfoMessage } from "../../actions/infoActions";
import PropTypes from "prop-types";
import classnames from "classnames";
import axios from "axios";
import "./TripleButtonCircle.css";
import SpinnerDelayed from "../common/SpinnerDelayed";
import GlobeIcon from "../SVGs/GlobeIcon/GlobeIcon";

export class TripleButtonCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  trapezoidMenuFunc(e) {
    this.setState(
      function (prevState) {
        return {
          openMenu: !prevState.openMenu,
        };
      }.bind(this),
      function (e) {
        if (this.state.openMenu === true) {
          var guide = {
            type: "obj",
            content: (
              <div>
                <span className="guideInfoHeader" style={{ "color": "chocolate" }}>
                  Guide:{" "}
                </span>
                <p>
                  <span style={{ "color": "cornflowerblue" }}>Public = </span>Accessible to all.
                </p>
                <p>
                  <span style={{ "color": "cornflowerblue" }}> Private = </span>Accessible only by quiz ID.
                </p>
                <p>
                  <span style={{ "color": "cornflowerblue" }}> Hidden = </span>Accessible only to you, the creator.
                </p>
              </div>
            ),
          };
          // this.props.addInfoMessage("Guide: Public = Accessible to all | Private = Accessible only by quiz ID | Hidden = Accessible only to you, the creator.");
          this.props.addInfoMessage(guide);
        }

        if (this.state.openMenu === false) this.setState({ isLoading: false });
      }
    );
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

    // console.log("mode: ", mode);
    // return;

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
            this.setState({ mode: Number(mode), isLoading: false, modeHasUpdated: true, openMenu: false });
            // this.setState({ mode: Number(mode), modeHasUpdated: true });
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
    const { openMenu, mode, isLoading } = this.state;
    // const { isPrivate, isHidden } = this.props;

    return (
      <div
        className={classnames("tripleBtnCircleWrapperDiv", {
          "trapezoidMenuActive": openMenu,
        })}
      >
        <div className="tripleBtnCircleDiv">
          <div
            className={classnames("worldBtnWrapper", {
              "worldBtnWrapperActive": openMenu,
            })}
            onClick={function (e) {
              this.trapezoidMenuFunc();
            }.bind(this)}
          >
            <SpinnerDelayed isLoading={isLoading} />
            <GlobeIcon isActive={openMenu} />
            {/* <button
                            onClick={function (e) { this.trapezoidMenuFunc(); }.bind(this)}
                            className="worldBtn">O</button> */}
          </div>
          <div className="trapezoidMenuWrapper">
            <div
              className={classnames("trapezoidMenu", {
                // "quizIsPublic": !isPrivate && !isHidden,
                // "quizIsPrivate": isPrivate === true,
                // "quizIsHidden": isHidden === true
              })}
            >
              <span
                className={classnames("", {
                  "quizIsPublic": mode === 1,
                })}
                onClick={function (e) {
                  this.changeMode(1);
                }.bind(this)}
              >
                <p>Public</p>
              </span>
              <span
                className={classnames("", {
                  "quizIsPrivate": mode === 2,
                })}
                onClick={function (e) {
                  this.changeMode(2);
                }.bind(this)}
              >
                <p>Private</p>
              </span>
              <span
                className={classnames("", {
                  "quizIsHidden": mode === 3,
                })}
                onClick={function (e) {
                  this.changeMode(3);
                }.bind(this)}
              >
                <p>Hidden</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TripleButtonCircle.propTypes = {
  infoMsgs: PropTypes.object,
  addInfoMessage: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    infoMsgs: state.infoMsgs,
  };
}

export default connect(mapStateToProps, { addInfoMessage })(TripleButtonCircle);

import React, { Component } from "react";
import "./Confirmation.css";
import classnames from "classnames";
import TickIcon from "../SVGs/TickIcon/TickIcon";
import axios from "axios";
import isEmpty from "../../validation/is-empty";

export class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startingAnim: false,
      reverseAnim: false,
      accountVerified: false,
    };
  }

  componentDidMount() {
    this.setState({ startingAnim: true }, function () {
      axios
        .get(`/api/users/confirm/${this.props.match.params.token}`)
        .then(
          function (res) {
            // console.log("res: ", res.data);
            this.setState({ accountVerified: true });
          }.bind(this)
        )
        .catch(
          function (err) {
            console.log("err: ", err.response.data);
            if (typeof err.response.data === "string") {
              var errors = {};
              errors.connectionError = true;
              this.setState({ errors });
            } else this.setState({ errors: err.response.data });
          }.bind(this)
        );
    });
  }

  render() {
    const { startingAnim, reverseAnim, repeatAnim, accountVerified, errors, connectionError } = this.state;

    return (
      <div className="accountConfirmationDiv">
        <div className="confirmationDivInner searchFormDiv registerForm">
          {accountVerified ? (
            <div className="accountVerifiedMsgDiv">
              <p className="confirmationMsg">Your account has been activated!</p>
              <div className="accVerifiedTickIconsDiv">
                <TickIcon />
                <TickIcon />
              </div>
            </div>
          ) : errors ? (
            <div className="errorsDiv">
              {!isEmpty(errors.verified) ? <span className="confirmationMsg verificationError">{errors.verified}</span> : null}
              {!isEmpty(errors.connectionError) ? <span className="confirmationMsg verificationError">Connection error</span> : null}
            </div>
          ) : (
            <div className="confirmationMsgDiv">
              <div className="verifyingAccountParagraphDiv">
                <p className="confirmationMsg">Activating your account</p>
                <div className="threeDotsDiv">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div
                className={classnames("loadingBarsWrapper", {
                  "loadingBarsWrapperStartAnim": startingAnim,
                  "loadingBarsWrapperReverseAnim": reverseAnim,
                  "loadingBarsWrapperRepeatAnim": repeatAnim,
                })}
              >
                <span
                  className="loadingBar"
                  onAnimationEnd={function () {
                    if (reverseAnim) {
                      this.setState({ reverseAnim: false }, function () {
                        setTimeout(
                          function () {
                            this.setState({ repeatAnim: true });
                          }.bind(this),
                          5
                        );
                      });
                    }
                  }.bind(this)}
                ></span>
                <span className="loadingBar"></span>
                <span className="loadingBar"></span>
                <span className="loadingBar"></span>
                <span
                  className="loadingBar"
                  onAnimationEnd={function (e) {
                    if (startingAnim) {
                      this.setState(
                        { startingAnim: false },
                        function () {
                          setTimeout(
                            function () {
                              this.setState({ reverseAnim: true });
                            }.bind(this),
                            5
                          );
                        }.bind(this)
                      );
                    }
                  }.bind(this)}
                ></span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Confirmation;

import React, { Component } from "react";
import "./Register.css";
import Tilt from "react-parallax-tilt";
import classnames from "classnames";
import axios from "axios";
import { Link } from "react-router-dom";
import SpinnerDelayed from "../common/SpinnerDelayed";
import isEmpty from "../../validation/is-empty";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errors: {},
      registerBorderBoxReady: false,
      registrationSuccessful: false,
      registerFormSlideOut: false,
      registrationSuccessfulDivSlideIn: false,
    };

    this.onChange = this.onChange.bind(this);
    // this.onBlur = this.onBlur.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  componentDidMount() {
    setTimeout(
      function () {
        this.setState({ registerBorderBoxReady: true });
      }.bind(this),
      2000
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // onBlur(e) {
  //   // const { errors, username, email, password, password2 } = this.state;
  // }

  registerUser(e) {
    e.preventDefault();

    const { errors, username, displayName, email, password, password2 } = this.state;

    this.setState({ errors: {}, isLoading: true, connectionError: false });

    const userData = {
      username,
      displayName,
      email,
      password,
      password2,
    };

    axios
      .post("/api/users/register", userData)
      .then(
        function (res) {
          // if (!isEmpty(res.data.token)) {
          //     console.log("token :", res.data.token);
          // }

          this.setState({ registerFormSlideOut: true, isLoading: false });
        }.bind(this)
      )
      .catch(
        function (error) {
          if (!isEmpty(error.response.data) && typeof error.response.data === "string") {
            this.setState({ connectionError: true });
            // console.log("registration error: ", error.response.data);
          }
          this.setState({ errors: error.response.data, isLoading: false });
        }.bind(this)
      );
  }

  render() {
    const {
      errors,
      registerBorderBoxReady,
      isLoading,
      connectionError,
      registrationError,
      registrationSuccessful,
      registerFormSlideOut,
      registrationSuccessfulDivSlideIn,
      inPosition,
    } = this.state;

    return (
      <div className="registerDiv">
        <h1 className="registerHeader">Sign up</h1>
        {/* <div className="borderBoxWrapper">


                    <div className={classnames("borderBox registerBorderBox", {
                        "registerBorderBoxReady": registerBorderBoxReady
                    })}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span> */}

        {registrationSuccessful !== true ? (
          <div
            className="registerFormWrapper"
            onAnimationEnd={function () {
              if (registerFormSlideOut) {
                this.setState(
                  { registrationSuccessful: true },
                  function () {
                    this.setState({ registrationSuccessfulDivSlideIn: true, registerFormSlideOut: false });
                  }.bind(this)
                );
              }
            }.bind(this)}
          >
            <Tilt
              perspective={30000}
              tiltMaxAngleX={7}
              tiltMaxAngleY={7}
              className="registerForm parallax-effect"
              onAnimationEnd={function () {
                this.setState({ inPosition: true });
              }.bind(this)}
            >
              <div className="inner-element">
                <form onSubmit={this.registerUser}>
                  <p className="lead text-center">Create your new Quiza account</p>

                  {/* Username */}
                  <div className="inputAndErrorDiv inputAndErrorDivRegister">
                    <div className="quizHelperDiv">
                      <label className="inputLabel inputLabelRegister">Username</label>
                      {/* <div
                                className="whatIsThis">?</div> */}
                    </div>
                    <input
                      maxLength="70"
                      autoComplete="off"
                      onChange={this.onChange}
                      onBlur={this.onBlur}
                      type="text"
                      name="username"
                      tabIndex="2"
                    ></input>
                    {errors.username ? (
                      <span className="errorSpan registerErrorSpan registerErrorSpanUsername">{errors.username}</span>
                    ) : null}
                  </div>

                  {/* Display name */}
                  <div className="inputAndErrorDiv inputAndErrorDivRegister">
                    <div className="quizHelperDiv">
                      <label className="inputLabel inputLabelRegister">Display name</label>
                    </div>
                    <input
                      maxLength="70"
                      autoComplete="off"
                      onChange={this.onChange}
                      onBlur={this.onBlur}
                      type="text"
                      name="displayName"
                      tabIndex="2"
                    ></input>
                    {errors.displayName ? (
                      <span className="errorSpan registerErrorSpan registerErrorSpanUsername">{errors.displayName}</span>
                    ) : null}
                  </div>

                  {/* .edu e-mail (for now allowing all emails) */}
                  <div className="inputAndErrorDiv inputAndErrorDivRegister">
                    <div className="quizHelperDiv">
                      {/* <label className="inputLabel inputLabelRegister">E e-mail</label> */}
                      <label className="inputLabel inputLabelRegister">Email</label>
                      {/* <div
                                className="whatIsThis">?</div> */}
                    </div>
                    <input maxLength="70" autoComplete="off" onChange={this.onChange} type="text" name="email" tabIndex="2"></input>
                    {errors.email ? <span className="errorSpan registerErrorSpan registerErrorSpanEmail">{errors.email}</span> : null}
                  </div>

                  {/* Password */}
                  <div className="inputAndErrorDiv inputAndErrorDivRegister">
                    <div className="quizHelperDiv passwordDiv">
                      <label className="inputLabel inputLabelRegister passwordLabel">Password</label>
                    </div>
                    <input autoComplete={"off"} onChange={this.onChange} type="password" name="password" tabIndex="3"></input>
                    {errors.password ? (
                      <span className="errorSpan registerErrorSpan registerErrorSpanPassword">{errors.password}</span>
                    ) : null}
                  </div>
                  {/* Password Confirmation */}
                  <div className="inputAndErrorDiv inputAndErrorDivRegister">
                    <div className="quizHelperDiv passwordDiv">
                      <label className="inputLabel inputLabelRegister passwordLabel">Password confirmation</label>
                    </div>
                    <input autoComplete={"off"} onChange={this.onChange} type="password" name="password2" tabIndex="3"></input>
                    {errors.password2 ? (
                      <span className="errorSpan registerErrorSpan registerErrorSpanPassword2">{errors.password2}</span>
                    ) : null}
                  </div>

                  {!isEmpty(connectionError) ? <span className="errorSpan errorSpanLogin">Connection error</span> : null}
                  {!isEmpty(errors.registration) ? <span className="errorSpan errorSpanLogin">{errors.registration}</span> : null}

                  <button className="submitBtn uploadQuizBtn registerBtn">Sign up</button>
                  <Link to="/login" className="createANewAccount alreadyHaveAccount">
                    I already have an account
                  </Link>

                  <div
                    className={classnames("loginLoadSpinner registerSpinner", {
                      "loginLoadSpinnerVisible": isLoading,
                    })}
                  >
                    <SpinnerDelayed isLoading={isLoading} />
                  </div>
                </form>
              </div>
            </Tilt>
          </div>
        ) : (
          <div
            className={classnames("registrationSuccessfulDiv", {
              "registrationSuccessfulDivSlideIn": registrationSuccessfulDivSlideIn,
            })}
          >
            <p className="confirmationMsg">Registration successful! Please check your email to activate your account.</p>
          </div>
        )}
        {/* </Tilt> */}

        {/* </div>
                </div> */}
      </div>
    );
  }
}

export default Register;

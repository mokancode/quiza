import React, { Component } from "react";
import "./ResetPassword.css";
import Tilt from "react-parallax-tilt";
import classnames from "classnames";
import isEmpty from "../../../validation/is-empty";
import SpinnerDelayed from "../../common/SpinnerDelayed";
import jwt_decode from "jwt-decode";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { resetPassword, requestPasswordReset } from "../../../actions/authActions";
import FormError from "../../common/FormError/FormError";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      isRequestForm: true,
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.requestResetPassword = this.requestResetPassword.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    /* This page shows one of two different forms depending on whether there exists a token query in the URL.
           If there exists a token then a "Reset Password" form will show where a user will have to enter their new password.
           If a token does not exist, then it's a "Request Password Reset" form where a user will have to enter either username or email.
        */

    // If token exists in query, then it's not a request form but a password reset form.

    var params = new URLSearchParams(this.props.location.search);
    const paramToken = params.get("token");
    if (!isEmpty(paramToken)) {
      // It's a Reset form.
      this.setState(
        { isRequestForm: false },
        function () {
          const { errors } = this.state;
          try {
            const decoded = jwt_decode(paramToken);
            // console.log("decoded: ", decoded);
            // console.log("token: ", paramToken);

            this.setState({ displayName: decoded.displayName, token: paramToken });

            if (Date.now() / 1000 > decoded.exp) {
              errors.token = "Token expired";
            }
            this.setState({ errors });
          } catch (err) {
            errors.token = "Invalid token";
            this.setState({ errors });
          }
        }.bind(this)
      );
    } else {
      // It's a Request form.
    }

    setTimeout(() => {
      this.setState({ showForm: true });
    }, 10);
  }

  resetPassword() {
    const { token, password, password2 } = this.state;
    this.setState({ isLoading: true, errors: {} });
    // this.setState({ resetPasswordFormSlideOut: true, isLoading: false });

    const userData = {
      token,
      password,
      password2,
    };

    const resetPasswordFunction = this.props.resetPassword;
    var promiseFunc = function (userData) {
      resetPasswordFunction(userData)
        .then(
          function (fulfilled) {
            if (fulfilled) {
              // console.log("fulfilled");
              this.setState({ resetPasswordFormSlideOut: true, isLoading: false });
            }
          }.bind(this)
        )
        .catch(
          function (error) {
            // console.log('error: ', isEmpty(error.login));

            // if (!isEmpty(error) && isEmpty(error.login) && isEmpty(error.match(/Incorrect Login/i))) {
            //     this.setState({ connectionError: true });
            // }

            console.log("reset password error: ", error);
            this.setState({ isLoading: false });
            this.setState({ errors: error.errors });
          }.bind(this)
        );
    }.bind(this);
    promiseFunc(userData);
  }

  requestResetPassword() {
    const { username, email } = this.state;
    this.setState({ isLoading: true, errors: {} });

    const userData = {
      username,
      email,
    };

    const requestPasswordResetFunction = this.props.requestPasswordReset;
    var promiseFunc = function (userData) {
      requestPasswordResetFunction(userData)
        .then(
          function (fulfilled) {
            if (fulfilled) {
              // console.log("fulfilled");
              this.setState({ resetPasswordFormSlideOut: true, isLoading: false });
            }
          }.bind(this)
        )
        .catch(
          function (error) {
            // console.log('error: ', isEmpty(error.login));

            // if (!isEmpty(error) && isEmpty(error.login) && isEmpty(error.match(/Incorrect Login/i))) {
            //     this.setState({ connectionError: true });
            // }

            console.log("request password reset error: ", error);
            this.setState({ isLoading: false });
            this.setState({ errors: error.errors });
          }.bind(this)
        );
    }.bind(this);
    promiseFunc(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {
      isLoading,
      inPosition,
      displayName,
      errors,
      resetPasswordSuccessful,
      resetPasswordSuccessfulDivSlideIn,
      resetPasswordFormSlideOut,
      connectionError,
      isRequestForm,
    } = this.state;

    const formType = isRequestForm ? (
      <form
        onSubmit={function (e) {
          e.preventDefault();
          this.requestResetPassword();
        }.bind(this)}
      >
        <p className="lead text-center">Enter your username or email</p>

        {/* Password */}
        <div className="inputAndErrorDiv inputAndErrorDivResetPassword">
          <div className="quizHelperDiv usernameDiv">
            <label className="inputLabel inputLabelRegister">Username</label>
          </div>
          <input autoComplete={"off"} onChange={this.onChange} type="username" name="username" tabIndex="1"></input>
          {errors.username ? <FormError text={errors.username} /> : null}
        </div>
        {/* Password Confirmation */}
        <div className="inputAndErrorDiv inputAndErrorDivResetPassword">
          <div className="quizHelperDiv emailDiv">
            <label className="inputLabel inputLabelRegister">Email</label>
          </div>
          <input autoComplete={"off"} onChange={this.onChange} type="email" name="email" tabIndex="2"></input>
          {errors.email ? <FormError text={errors.email} /> : null}
        </div>

        {!isEmpty(connectionError) ? <FormError text="Connection error" /> : null}
        {!isEmpty(errors.passwordResetRequest) ? <FormError text={errors.passwordResetRequest} /> : null}

        <button tabIndex="3" className="submitBtn uploadQuizBtn registerBtn submitResetPasswordBtn">
          Submit
        </button>

        <div
          className={classnames("loginLoadSpinner registerSpinner", {
            "loginLoadSpinnerVisible": isLoading,
          })}
        >
          <SpinnerDelayed isLoading={isLoading} />
        </div>
      </form>
    ) : (
      <form
        onSubmit={function (e) {
          e.preventDefault();
          this.resetPassword();
        }.bind(this)}
      >
        <p className="lead text-center">Enter you new password</p>

        {/* Password */}
        <div className="inputAndErrorDiv inputAndErrorDivResetPassword">
          <div className="quizHelperDiv passwordDiv">
            <label className="inputLabel inputLabelRegister passwordLabel">Password</label>
          </div>
          <input autoComplete={"off"} onChange={this.onChange} type="password" name="password" tabIndex="1"></input>
          {errors.password ? <FormError text={errors.password} /> : null}
        </div>
        {/* Password Confirmation */}
        <div className="inputAndErrorDiv inputAndErrorDivResetPassword">
          <div className="quizHelperDiv passwordDiv">
            <label className="inputLabel inputLabelRegister passwordLabel">Password confirmation</label>
          </div>
          <input autoComplete={"off"} onChange={this.onChange} type="password" name="password2" tabIndex="2"></input>
          {errors.password2 ? <FormError text={errors.password2} /> : null}
        </div>

        {!isEmpty(connectionError) ? <FormError text="Connection error" /> : null}
        {!isEmpty(errors.resetpassword) ? <FormError text={errors.resetpassword} /> : null}

        <button tabIndex="3" className="submitBtn uploadQuizBtn registerBtn submitResetPasswordBtn">
          Submit
        </button>

        <div
          className={classnames("loginLoadSpinner registerSpinner", {
            "loginLoadSpinnerVisible": isLoading,
          })}
        >
          <SpinnerDelayed isLoading={isLoading} />
        </div>
      </form>
    );

    return (
      <div className="resetPasswordPage">
        {isRequestForm && isEmpty(errors.token) ? (
          <h1 className="registerHeader">Reset password</h1>
        ) : isEmpty(errors.token) ? (
          <h1 className="registerHeader">{`Hello ${displayName ? displayName : ""}`}</h1>
        ) : null}

        {!isEmpty(errors.token) ? (
          <FormError text={errors.token} />
        ) : resetPasswordSuccessful !== true ? (
          <div
            className="resetPasswordFormWrapper"
            onAnimationEnd={function () {
              if (resetPasswordFormSlideOut) {
                this.setState(
                  { resetPasswordSuccessful: true },
                  function () {
                    this.setState({ resetPasswordSuccessfulDivSlideIn: true, resetPasswordFormSlideOut: false });
                  }.bind(this)
                );
              }
            }.bind(this)}
          >
            <Tilt
              perspective={30000}
              tiltMaxAngleX={7}
              tiltMaxAngleY={7}
              className={classnames("searchFormDiv createQuizSearchFormDiv registerForm parallax-effect resetPasswordTilt", {
                "resetPasswordFormSlideOut": resetPasswordFormSlideOut,
                "inPosition": inPosition,
              })}
              onAnimationEnd={function () {
                this.setState({ inPosition: true });
              }.bind(this)}
            >
              <div className="inner-element">{formType}</div>
            </Tilt>
          </div>
        ) : (
          <div
            className={classnames("registrationSuccessfulDiv resetPasswordSuccessfulDiv", {
              "registrationSuccessfulDivSlideIn resetPasswordSuccessfulDivSlideIn": resetPasswordSuccessfulDivSlideIn,
            })}
          >
            {isRequestForm ? (
              <p className="confirmationMsg">
                Request received. If such a username or email exists in the system you will receive an email.
              </p>
            ) : (
              <p className="confirmationMsg">Success. You may log in now.</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(connect(mapStateToProps, { requestPasswordReset, resetPassword })(ResetPassword));
// export default ResetPassword;

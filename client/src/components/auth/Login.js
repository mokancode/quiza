import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import { Redirect, withRouter } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import "./Login.css";
import Spinner from "../common/Spinner";
import classnames from "classnames";
import { Link } from "react-router-dom";
import SpinnerDelayed from "../common/SpinnerDelayed";
import isEmpty from "../../validation/is-empty";

// import io from 'socket.io-client';
// const socketUrl = "localhost:5001";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
      connectionError: false,
      isLoading: false,
      // socket: null
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.updateConnectedUsersList = this.updateConnectedUsersList.bind(this);
  }

  componentDidMount() {
    // if (this.props.socket.disconnected) {
    //     this.props.history.push('/');
    // }
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push('/dashboard');
      this.props.history.push("/myquizzes");
    }

    // console.log("Login props socket: ", this.props.socket);

    // setTimeout(() => {
    // console.log("Login props socket: ", this.props.socket);
    // }, 3000);
    // this.socketStuff();
  }

  // socketStuff() {
  //     const { auth } = this.props;
  //     var { socket } = this.props;

  //     // console.log("socket: ", socket);
  //     if (socket === null || socket === undefined || (socket && socket.disconnected)) {
  //         console.log("Socket was not received from props");
  //         socket = io(socketUrl);
  //         socket.on('connect', function () {
  //             console.log("Socket connected from dashboard (client)");
  //         });

  //         this.setState({ socket });
  //     } else {
  //         console.log("Socket received from props");
  //     }

  //     // socket.on('updateConnectedUsersList', this.updateConnectedUsersList);
  // }

  // updateConnectedUsersList(res) {
  //     if (res.error) {
  //         this.setState({ errors: res.error });
  //     }
  // }

  // componentWillUnmount() {
  //     const { socket } = this.state;
  //     socket.disconnect();
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      // nextProps.history.push('/dashboard');
      nextProps.history.push("/myquizzes");
    }

    if (nextProps.errors) {
      return {
        errors: nextProps.errors,
      };
    }

    return null;
  }

  onSubmit(e) {
    e.preventDefault();
    // const { socket } = this.state;

    this.setState({ errors: {}, connectionError: false });

    const userData = {
      username: this.state.username,
      password: this.state.password,
    };

    this.setState({ isLoading: true });

    // return;

    // console.log("socket from login submit: ", socket);
    const loginUserFunction = this.props.loginUser;
    var mPromise = function (userData) {
      loginUserFunction(userData)
        .then(
          function (fulfilled) {
            if (fulfilled) {
              this.setState({ isLoading: false });
            }
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log("error: ", error);
            if (!isEmpty(error) && isEmpty(error.login) && typeof error === "String" && isEmpty(error.match(/Incorrect Login/i))) {
              this.setState({ connectionError: true });
            }
            // console.log("login error: ", error);
            this.setState({ isLoading: false });
          }.bind(this)
        );
    }.bind(this);
    mPromise(userData);
  }

  onChange(e) {
    // var errors = this.state.errors;
    // errors[e.target.name] = '';
    // this.setState({ errors: errors });
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, connectionError, isLoading } = this.state;
    return (
      <div className="loginMainDiv">
        {/* {this.props.socket.disconnected ?
                    <Redirect to={{
                        pathname: '/',
                        state: { refreshpage: true }
                    }} /> :
                    // this.props.history.push('/dashboard') :
                ( */}
        <h1 className="display-4 text-center loginHeader">Login</h1>

        <div className="loginFromWrapper">
          <Tilt className="loginForm parallax-effect" perspective={30000} tiltMaxAngleX={3} tiltMaxAngleY={3}>
            <div className="inner-element">
              <form onSubmit={this.onSubmit} noValidate>
                <p className="lead text-center">Sign in to your Quiza account</p>
                <div className="loginInputs">
                  <div className="inputAndErrorDiv inputAndErrorDivLogin">
                    <label className="inputLabel">Username</label>
                    <TextFieldGroup
                      placeholder="Username"
                      name="username"
                      type="text"
                      value={this.state.username}
                      onChange={this.onChange}
                      error={errors.username}
                      extraClass="loginInput"
                      // maxLength={}
                    />
                  </div>

                  <div className="inputAndErrorDiv inputAndErrorDivLogin">
                    <label className="inputLabel">Password</label>
                    <TextFieldGroup
                      placeholder="Password"
                      name="password"
                      type="password"
                      value={this.state.password}
                      onChange={this.onChange}
                      error={errors.password}
                    />
                  </div>
                  {!isEmpty(connectionError) ? (
                    <span className="errorSpan errorSpanLogin">Connection error</span>
                  ) : isEmpty(connectionError) && errors.login ? (
                    <span className="errorSpan errorSpanLogin">{errors.login}</span>
                  ) : null}
                  {/* {errors.login && (<span className="errorSpan errorSpanLogin">{errors.login}</span>)} */}
                </div>
                <button type="submit" className="submitBtn uploadQuizBtn loginBtn">
                  Sign in
                </button>
                <Link to="/register" className="createANewAccount">
                  Create a new account
                </Link>
                <Link to="/resetpassword" className="createANewAccount">
                  Forgot password
                </Link>
                <div
                  className={classnames("loginLoadSpinner", {
                    "loginLoadSpinnerVisible": isLoading,
                  })}
                >
                  <SpinnerDelayed isLoading={isLoading} />
                </div>
              </form>
            </div>
          </Tilt>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default withRouter(connect(mapStateToProps, { loginUser })(Login));

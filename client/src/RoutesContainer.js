import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import PrivateRoute from "./components/common/PrivateRoute";
import Login from "./components/auth/Login";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import SearchQuiz from "./components/search_quiz/SearchQuiz";
// import Sidebar from "./components/sidebar/Sidebar";
import Quizzes from "./components/quizzes/Quizzes";
// import Friend from "./components/friend/Friend";
import TakeQuiz from "./components/quizzes/TakeQuiz";
import CreateQuiz from "./components/quizzes/CreateQuiz";
import MyQuizzes from "./components/myquizzes/MyQuizzes";
import Register from "./components/auth/Register";
import { Route, Switch, Link, withRouter } from "react-router-dom";
import Settings from "./components/settings/Settings";
import History from "./components/quizzes/History";
import InfoFeed from "./components/common/InfoFeed";
import "react-app-polyfill/ie11";
import Confirmation from "./components/Confirmation/Confirmation";
import axios from "axios";
import ResetPassword from "./components/auth/ResetPassword/ResetPassword";

export class RoutesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appVer: "1.0.0.0", // Front-end version
      apiVer: "", // Back-end (API) version
    };
  }

  componentDidMount() {
    axios
      .get("/api/getapiversion")
      .then((res) => {
        console.log(`api v${res.data}`);
        this.setState({ apiVer: res.data });
      })
      .catch((err) => {
        console.log("error fetching API version");
      });
  }

  render() {
    const { styles } = this.props;
    const { isAuthenticated } = this.props.auth;
    const { user } = this.props.auth;
    const { appVer, apiVer } = this.state;

    return (
      <div className="mContainerWrapper">
        <div className="mContainer">
          <div id="appVerWrapper">
            <p id="appVer">
              v{appVer}, API v{apiVer}
            </p>
          </div>

          {/* <button type='button' onClick={this.testMe}>Test State</button> */}
          <div className="navbarRouteContainer">
            <Navbar
            // socket={socket} testMe={this.testMe}
            />
            {isAuthenticated ? <p className="displayNameMobile">{user.displayName}</p> : null}
          </div>

          <div className="routesContainer">
            {/* <div className="routesContainerSideBar">
                            <Sidebar />
                        </div> */}
            <div className="routesContainerInner">
              <Route exact path="/" component={Landing} />
              {/* <Route exact path='/login' component={Login} socket={socket} /> */}
              <Route exact path="/quiz/:id" component={TakeQuiz} />
              <Route exact path="/confirm/:token" component={Confirmation} />
              <Route exact path="/quizzes" component={Quizzes} />
              <Route exact path="/resetpassword" component={ResetPassword} />
              <Route exact path="/register" component={Register} />
              <Route
                exact
                path="/login"
                render={(props) => (
                  <Login
                    {...props}
                    // socket={socket}
                  />
                )}
              />
              <Route exact path="/searchquiz" render={(props) => <SearchQuiz {...props} />} />
              {/* // socket={socket} */}
              {/* // setSocket={this.setSocket} */}
              {/* <Route exact path='/searchquiz' render={function (props) { return <SearchQuiz {...props} /> }} /> */}
              {/* <Route exact path='/searchquiz' render={function (props) { return <SearchQuiz props={Object.assign({}, props)} /> }} /> */}
              <Switch>
                {/* <PrivateRoute
                                exact path='/dashboard'
                                component={Dashboard}
                                socket={socket}
                                setSocket={this.setSocket}
                            /> */}
                <PrivateRoute
                  exact
                  path="/myquizzes"
                  component={MyQuizzes}
                  // socket={socket}
                />
                <PrivateRoute
                  // exact path='/createquiz/:id/'
                  exact
                  path="/createquiz"
                  component={CreateQuiz}
                  // socket={socket}
                />
                {/* <PrivateRoute
                  exact
                  path="/friend/:id"
                  component={Friend}
                  // socket={socket}
                /> */}
                <PrivateRoute
                  exact
                  path="/settings"
                  component={Settings}
                  // socket={socket}
                />
                <PrivateRoute
                  exact
                  path="/history"
                  component={History}
                  // socket={socket}
                />
              </Switch>
            </div>
          </div>
        </div>
        <InfoFeed />
      </div>
    );
  }
}

RoutesContainer.propTypes = {
  styles: PropTypes.object,
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    styles: state.styles,
    auth: state.auth,
  };
}

// export default RoutesContainer;
export default withRouter(connect(mapStateToProps, {})(RoutesContainer));

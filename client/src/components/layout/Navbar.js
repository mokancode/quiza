import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getFriendRequests, getRequests } from "../../actions/requestActions";
import PropTypes from "prop-types";
import "./Navbar.css";
import axios from "axios";
import classnames from "classnames";
import FriendRequestsList from "./FriendRequestsList";
import { resolve } from "url";
import QuizIcon from "../SVGs/QuizIcon/QuizIcon";
import HistoryIcon from "../SVGs/HistoryIcon/HistoryIcon";
import SettingsIcon from "../SVGs/SettingsIcon/SettingsIcon";
import CreateQuizIcon from "../SVGs/CreateQuizIcon/CreateQuizIcon";
import SearchIcon from "../SVGs/SearchIcon/SearchIcon";
import LogoutIcon from "../SVGs/LogoutIcon/LogoutIcon";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      friendRequests: [],
      friendRequestsNames: [],
      numberOfFriendRequests: 0,
      showFriendRequests: false,
      showNoFriendRequests: false,
    };

    this.onLogoutClick = this.onLogoutClick.bind(this);
    // this.updateFriendRequests = this.updateFriendRequests.bind(this);
    // this.socketStuff = this.socketStuff.bind(this);
    // this.showFriendRequests = this.showFriendRequests.bind(this);
    this.createQuiz = this.createQuiz.bind(this);
  }

  // onLogoutClick = (e) => {
  onLogoutClick(e) {
    e.preventDefault();
    // const { socket } = this.props;

    // socket.disconnect();
    // console.log("socket of logout (NavBar): ", socket);
    // this.props.logoutUser(socket);
    this.props.logoutUser();

    // console.log("navbar props: ", this.props);
    this.props.history.push("/login");
  }

  componentWillReceiveProps(nextProps) {
    // const { auth } = this.props;
    // this.setState({ friendRequests: nextProps.requests.requests.filter(elt => elt.requestType === 'friend') });
    // var filtered = nextProps.requests.requests.filter(function (elt) { return elt.requestType === 'friend' });
    // this.setState({ friendRequests: filtered });
    // if (nextProps.requests.requests) {
    //     var { requests } = nextProps.requests;
    // }
  }

  componentDidMount() {
    // this.socketStuff();
  }

  // socketStuff() {
  //     const { auth } = this.props;
  //     var { socket } = this.props;

  //     socket.on('receiveUpdateRequests', function (data) {
  //         console.log("navbar receive: ", data);
  //         this.props.getRequests();
  //     }.bind(this));

  //     socket.on('logMeOut', function () {
  //         console.log("socket log me out");
  //         // socket.disconnect();
  //         this.props.logoutUser(socket);
  //     }.bind(this));

  // }

  // updateFriendRequests(requests) {
  //     // console.log("requests: ", requests);
  //     var friendRequests = requests.filter(request => request.requestType === 'friend');
  //     // console.log("friendRequests: ", friendRequests);
  //     this.setState({ friendRequests });
  // }

  // setFriends = (friends) => {
  //     console.log("setFriends");
  //     this.setState({ friendRequestsNames: friends });
  // }

  // showFriendRequests(e) {

  //     // // var { friendRequests, friendRequestsNames } = this.state;

  //     // var { requests } = this.props.requests;
  //     // var friendRequestsNames = this.props.requests.friendRequests;

  //     // var friendRequests = requests.filter(elt => elt.requestType === 'friend');
  //     // // return console.log("fr requests:", friendRequests);

  //     // if (friendRequestsNames.length <= 0 || friendRequests.length !== friendRequestsNames.length) {

  //     //     const mFunc = this.props.getFriendRequests(friendRequests);
  //     //     var mPromise = function () {
  //     //         mFunc
  //     //             .then(function (fulfilled) {
  //     //                 console.log("promise success: ", fulfilled);
  //     //                 // this.setState({ friendRequestsNames: fulfilled });
  //     //                 this.setFriends(fulfilled);
  //     //             }.bind(this))
  //     //             .catch(function (error) {
  //     //                 console.log("promise error: ", error);
  //     //             });
  //     //     }.bind(this);
  //     //     mPromise();
  //     //     // this.props.getFriendRequests(friendRequests);
  //     // }

  //     // this.setState(prevState => ({
  //     //     showFriendRequests: !prevState.showFriendRequests
  //     // }));
  // }

  // showNoFriendRequests(e) {
  //     // this.setState(prevState => ({
  //     //     showNoFriendRequests: !prevState.showNoFriendRequests
  //     // }), function () {
  //     //     var timer =
  //     //         setTimeout(function () {
  //     //             if (this.state.showNoFriendRequests === true) {
  //     //                 this.setState(prevState => ({
  //     //                     showNoFriendRequests: !prevState.showNoFriendRequests
  //     //                 }));
  //     //             }
  //     //         }.bind(this), 2000);

  //     //     if (this.state.showNoFriendRequests === false) {
  //     //         while (timer--) {
  //     //             window.clearTimeout(timer); // will do nothing if no timeout with id is present
  //     //         }
  //     //     }
  //     // });
  // }

  render() {
    // console.log("Navbar render");

    const { isAuthenticated, user } = this.props.auth;
    var { showFriendRequests, showNoFriendRequests, menuOpen } = this.state;
    const { socket, styles } = this.props;

    var { friendRequests, friendRequestsNames } = this.state;
    // console.log("friendRequests", friendRequests);
    // console.log("friendRequestsNames", friendRequestsNames);
    // var friendRequestsNames = this.props.requests.friendRequests;

    // console.log("render friendRequests: ", friendRequests);
    // console.log("render friendRequests LENGTH: ", friendRequests.length);

    var authLinks = (
      <ul className="navbar-nav ml-auto">
        {/* <li className="nav-item">
                    {friendRequests.length > 0 ?
                        <div

                            className="barIcons">
                            <button
                                //  disabled={!friendRequests.length > 0}
                                onClick={this.showFriendRequests.bind(this)}
                            >
                                <img src="/images/friends.svg" alt="friends"
                                    className={classnames("friendImgIcon", {
                                        'active': showFriendRequests
                                        // && friendRequestsNames.length > 0
                                        //     && friendRequestsNames.length === friendRequests.length
                                    })}
                                />
                            </button>
                            {friendRequests.length > 0 ? <p id="numberOfFriendRequests">{friendRequests.length}</p> : null}
                        </div>
                        :
                        <div

                            className="barIcons">
                            <button
                                //  disabled={!friendRequests.length > 0}
                                onClick={this.showNoFriendRequests.bind(this)}
                            >
                                <img src="/images/friends.svg" alt="friends"
                                    className={classnames("friendImgIcon second", {
                                        'active': showNoFriendRequests
                                        // && friendRequestsNames.length > 0
                                        //     && friendRequestsNames.length === friendRequests.length
                                    })}
                                />
                            </button>
                            <span className={classnames("noRequestsCurrently", {
                                "visible": showNoFriendRequests
                                // && (friendRequestsNames === null || friendRequestsNames.length === 0)
                            })}>No requests yet</span>
                            <span className={classnames("noRequestsCurrentlyTriangle", {
                                'visible': showNoFriendRequests
                            })}></span>
                        </div>
                    }

                    {/* <div className={classnames("pCont", {
                        'visible': showFriendRequests && friendRequests.length > 0
                    })}> */}

        {/* <div className="ppCont"> */}

        {/* {showFriendRequests && friendRequestsNames.length ?
                        <div className={classnames("pCont", {
                            'visible': showFriendRequests && friendRequestsNames.length > 0
                        })}> */}

        {/* <FriendRequestsList
                        socket={socket}
                        friendRequestsNames={friendRequestsNames}
                        showFriendRequests={showFriendRequests}
                        showFriendRequestsFunc={this.showFriendRequests} /> */}
        {/* <span className={classnames("noRequestsCurrently", {
                        "visible": 
                    })}>No requests yet</span> */}

        {/* </div>
                        : null} */}

        {/* </li> */}

        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          {/* <p onClick={function (e) { }.bind(this)} className="nav-link">My Quizzes</p> */}
          <Link to="/myquizzes" className="nav-link">
            My Quizzes
          </Link>
          {/* <div className="navbarIconWrapper"> */}
          <QuizIcon />
          {/* </div> */}
        </li>

        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          {/* <p onClick={function (e) { }.bind(this)} className="nav-link">History</p> */}
          <Link to="/history" className="nav-link">
            History
          </Link>
          <div className="navbarIconWrapper">
            <HistoryIcon />
          </div>
        </li>

        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          {/* <p onClick={function (e) { this.createQuiz(e) }.bind(this)} className="nav-link">Settings</p> */}
          <Link to="/settings" className="nav-link">
            Settings
          </Link>
          <div className="navbarIconWrapper">
            <SettingsIcon />
            <SettingsIcon />
          </div>
        </li>

        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          <p
            onClick={function (e) {
              this.createQuiz(e);
            }.bind(this)}
            className="nav-link"
          >
            Create
          </p>
          {/* <Link to="/createquiz" className="nav-link">Create</Link> */}
          <div className="navbarIconWrapper">
            <CreateQuizIcon />
          </div>
        </li>
        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          <Link to="/searchquiz" className="nav-link">
            Search
          </Link>
          <div className="navbarIconWrapper">
            <SearchIcon />
          </div>
        </li>
        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          <button
            style={{ background: "none", outline: "none", border: "none" }}
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            Logout
          </button>
          <div className="navbarIconWrapper">
            <LogoutIcon />
          </div>
        </li>
      </ul>
    );

    var guestLinks = (
      <ul className="navbar-nav ml-auto navGuestLinks">
        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          <Link to="/searchquiz" className="nav-link">
            Search
          </Link>
          <div className="navbarIconWrapper">
            <SearchIcon />
          </div>
        </li>
        <li
          className="nav-item"
          onClick={function (e) {
            this.setState({ menuOpen: false });
          }.bind(this)}
        >
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <div className="navbarIconWrapper">
            <LogoutIcon />
          </div>
        </li>
      </ul>
    );

    // console.log("Navbar props:", this.props);

    return (
      // <nav className="navbar navbar-expand-sm navbar-dark bg-dark"
      <nav
        className={classnames("navbarDiv", {
          "brightNavbar": styles.navbarShadow === "bright",
          "navbarMobileDiv": menuOpen === true,
        })}
      >
        {/* <button type="button"
                    onClick={this.showFriendRequests}>Test Focus</button> */}

        <div className="headerAndWelcomeDiv">
          <Link to="/" className="quizaLogo">
            {/* Quiza */}
            <img src={"/images/quizaLogoTransparent.png"} />
          </Link>
          {isAuthenticated ? (
            <p className="welcomeText">
              Welcome, <span className="welcomeTextUsername">{user.displayName}</span>
            </p>
          ) : (
            <p className="welcomeText">Welcome</p>
          )}

          <div
            className={classnames("navbarHamburgerWrapper", {
              "navbarHamburgerWrapperOpen": menuOpen,
            })}
          >
            <button
              onClick={function (e) {
                this.setState(
                  function (prevState) {
                    return {
                      menuOpen: !prevState.menuOpen,
                    };
                  }.bind(this)
                );
              }.bind(this)}
              className={classnames("navbarHamburger", {
                "navbarHamburgerOpen": menuOpen,
              })}
            ></button>
          </div>
        </div>

        <div className="navbarLinksContainer">
          {/* <ul className="navbar-nav mr-auto"> */}
          {/* <li className="nav-item">
                                <Link to='/profiles' className="nav-link">Users</Link>
                            </li> */}
          {/* </ul> */}

          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    );
  }

  createQuiz(e) {
    const { auth } = this.props;
    // console.log("navbar create quiz user id", auth.user.id);
    const quizBody = {
      // quizId = '',
      courseBody: {},
      majorBody: {},
      schoolBody: {},
      quizTerm: {},
      questionsList: [],
      quizCreatorName: auth.user.username,
      quizCreatorId: auth.user.id,
      quizName: "",
      teacherName: "",
    };

    axios
      .post("/api/quizzes/addquizdraft", quizBody)
      .then(
        function (res) {
          // console.log("draft created from navbar: ", res.data);
          this.props.history.push(`/createquiz?qid=${res.data._id}`);
        }.bind(this)
      )
      .catch(
        function (err) {
          console.log("problem creating draft", err);
        }.bind(this)
      );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getRequests: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  requests: PropTypes.object,
  styles: PropTypes.object,
};

// const mapStateToProps = (state) => ({
function mapStateToProps(state) {
  return {
    auth: state.auth,
    requests: state.requests,
    styles: state.styles,
  };
}
// })

export default withRouter(connect(mapStateToProps, { logoutUser, getFriendRequests, getRequests })(Navbar));

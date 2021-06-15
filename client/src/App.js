import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

// import io from 'socket.io-client';

import { Provider } from "react-redux";
import store from "./store";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import RoutesContainer from "./RoutesContainer";
import { createStorageListener } from "./middleware/storageMiddleware";

import classnames from "classnames";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header 'Authorization'
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login page
    window.location.href = "/login";
  }
}

// const socketUrl = "localhost:5001";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // socket: null,
    };

    // this.setSocket = this.setSocket.bind(this);
  }

  componentDidMount() {
    window.addEventListener("storage", createStorageListener(store));
  }

  componentWillMount() {
    // this.initSocket();
  }

  // initSocket = () => {
  //   // const socket = io(socketUrl);
  //   // console.log("socket created in App.js", socket);
  //   socket.on('connect', function () {
  //     console.log("Socket connected from App.js (client)", socket);
  //   });

  //   this.setState({ socket });
  // }

  // setSocket(socket) {
  //   // console.log("setSocket from App.js", socket);
  //   this.setState({ socket });
  // }

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps: ", nextProps);
  }

  render() {
    // console.log("App.js render props: ", this.props);
    // const { socket } = this.state;

    // console.log("socket from App.js state: ", socket);

    return (
      <Provider store={store}>
        <Router>
          <RoutesContainer />
        </Router>
      </Provider>
    );
  }
}

export default App;

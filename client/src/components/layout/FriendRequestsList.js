import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { rejectFriendRequest, acceptFriendRequest, getFriends } from "../../actions/requestActions";
import Spinner from "../common/Spinner";

class FriendRequestsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendRequestsNames: null,
      friendRequests: [],
      friendRequestsNamesListLength: false,
    };

    this.acceptOrRejectFriendRequest = this.acceptOrRejectFriendRequest.bind(this);
    this.updateFriendRequestsNames = this.updateFriendRequestsNames.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("receive props", nextProps);

    if (nextProps.requests.friendRequests && nextProps.requests.requests.length === nextProps.requests.friendRequests.length) {
      var sortedFriendRequestNames = Object.assign([], nextProps.friendRequestsNames);
      sortedFriendRequestNames = sortedFriendRequestNames.sort(function (a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      this.setState({ friendRequestsNames: sortedFriendRequestNames }, function () {
        this.setState({ friendRequestsNamesListLength: this.state.friendRequestsNames.length > 0 });
      });
    }
  }

  updateFriendRequestsNames(friendRequestsNames) {
    if (friendRequestsNames.length === 0) {
      this.setState({ friendRequestsNames: null });
      this.setState({ friendRequestsNamesListLength: false });
    } else {
      this.setState({ friendRequestsNames }, function () {
        if (this.state.friendRequestsNames.length > 0) {
          this.setState({ friendRequestsNamesListLength: true });
        } else {
          this.setState({ friendRequestsNamesListLength: false });
        }
      });
    }
  }

  acceptOrRejectFriendRequest(choice, index) {
    var { friendRequestsNames } = this.props;

    if (!choice) {
      // a falsy "choice" means Reject

      const rejectFriendRequest = this.props.rejectFriendRequest(friendRequestsNames[index]._id);
      var mPromise = function () {
        rejectFriendRequest
          .then(
            function (fulfilled) {
              // console.log("promise success: ", fulfilled);
              // console.log("fr before", friendRequestsNames);

              friendRequestsNames.splice(index, 1);
              this.updateFriendRequestsNames(friendRequestsNames);

              // this.setState({ friendRequestsNames }, function () {
              // console.log("fr after", this.state.friendRequestsNames);
              // });
            }.bind(this)
          )
          .catch(function (error) {
            console.log("promise error: ", error);
          });
      }.bind(this);
      mPromise();
    } else {
      // a truthy "choice" means Accept

      const acceptFriendRequest = this.props.acceptFriendRequest(friendRequestsNames[index]._id);
      var mPromise = function () {
        acceptFriendRequest
          .then(
            function (fulfilled) {
              // console.log("promise success: ", fulfilled);
              // console.log("fr before", friendRequestsNames);

              friendRequestsNames.splice(index, 1);
              this.updateFriendRequestsNames(friendRequestsNames);

              this.props.getFriends();

              // const mFunc = this.props.getFriends();
              // var mPromise = function () {
              //     mFunc
              //         .then(function (fulfilled) {
              //             console.log("promise success: ", fulfilled);
              //             // this.setState({ friendRequestsNames: fulfilled });
              //             this.setState({ friendList: fulfilled });
              //         }.bind(this))
              //         .catch(function (error) {
              //             console.log("promise error: ", error);
              //         });
              // }.bind(this);
              // mPromise();

              // this.setState({ friendRequestsNames }, function () {
              // console.log("fr after", this.state.friendRequestsNames);
              // });
            }.bind(this)
          )
          .catch(function (error) {
            console.log("promise error: ", error);
          });
      }.bind(this);
      mPromise();
    }
  }

  render() {
    var { showFriendRequests, showFriendRequestsFunc } = this.props;
    var { requests } = this.props.requests;
    var { friendRequestsNames } = this.state;
    // var friendRequestsNames = [];

    // var friendRequestsNamesListLength = friendRequestsNames.length > 0;
    var { friendRequestsNamesListLength } = this.state;

    // console.log("friendRequestsNames", friendRequestsNames);
    // console.log("friendRequestsNamesListLength", friendRequestsNamesListLength);

    return (
      // <div className={classnames("pCont", {
      //     'visible': showFriendRequests && friendRequestsNames.length > 0
      // })}>
      <div className="pCont">
        {/* {friendRequestsNames.length > 0 ? */}
        {/* {showFriendRequests ? */}
        <div className="friendRequestListTopContainer">
          {/* /////////////////// edge triangle/pointer /////////////////// */}
          <span
            className={classnames("listTriangle", {
              "visible": showFriendRequests && friendRequestsNamesListLength,
            })}
          ></span>

          <div
            className={classnames("friendRequestListDivWrapper", {
              "visible": showFriendRequests && friendRequestsNamesListLength,
            })}
          >
            {/* /////////////////// "Friend requests" HEADER /////////////////// */}
            <div className="friendrequestsheaderParent">
              <h6 id="friendrequestsheader">Friend requests</h6>
            </div>

            {/* {friendRequestsNamesListLength ? */}
            {
              friendRequestsNames ? (
                //{true ?
                <div ref="friendRequestsListDiv" className="friendRequestListDiv">
                  <ul className="friendRequestList">
                    {friendRequestsNames.map((req, index) => {
                      return (
                        <li className="friendRequestElt" key={req._id}>
                          <p className="friendReqEltName">{req.displayname}</p>
                          <div className="AcceptOrRejectButtons">
                            <button
                              onClick={this.acceptOrRejectFriendRequest.bind(this, true, index)}
                              name="accept"
                              type="button"
                              className="friendReqEltBtn Accept"
                              title="Accept"
                            >
                              <span>&#10004;</span>
                            </button>
                            <button
                              onClick={this.acceptOrRejectFriendRequest.bind(this, false, index)}
                              name="reject"
                              type="button"
                              className="friendReqEltBtn Reject"
                              title="Reject"
                            >
                              <span>&#9932;</span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                // requests.length !== friendRequestsNames.length ?
                <Spinner friendRequestsNamesListLength={friendRequestsNamesListLength} />
              )
              // : null
            }
            <div onClick={showFriendRequestsFunc} className="closingBtn">
              <img id="closeFriendRequestsBtn" src="/images/upwardTriangleRounded.svg" alt="Close" />
            </div>
          </div>
        </div>
        {/* : null
    } */}
      </div>
    );
  }
}

FriendRequestsList.propTypes = {
  rejectFriendRequest: PropTypes.func.isRequired,
  getFriends: PropTypes.func.isRequired,
  requests: PropTypes.object,
};

const mapStateToProps = (state) => ({
  requests: state.requests,
});

export default connect(mapStateToProps, { rejectFriendRequest, acceptFriendRequest, getFriends })(FriendRequestsList);

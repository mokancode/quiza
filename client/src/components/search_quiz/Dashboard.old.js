import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import './Dashboard.css';
import { createFriendRequest } from '../../actions/authActions';
import axios from 'axios';
import { getRequests, getSentRequests, getFriends } from '../../actions/requestActions';
import classnames from 'classnames';

const socketUrl = "localhost:5001";

export class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            someList: [],
            connectedUsersList: [],
            friendList: [],
            error: '',
            sentFriendRequests: [],
            receivedFriendRequests: []
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.createMessage = this.createMessage.bind(this);
        this.addToList = this.addToList.bind(this);
        this.updateConnectedUsersList = this.updateConnectedUsersList.bind(this);
        this.updateFriendsList = this.updateFriendsList.bind(this);
    }

    componentDidMount() {
        // console.log("dashboard props: ", this.props);
        this.socketStuff();
        console.log("dashboard did mount, props: ", this.props);
        // this.props.navbarShouldUpdate(true);





        const getReceivedRequests = this.props.getRequests();
        var getReceivedRequestsPromise = function () {
            getReceivedRequests
                .then(function (fulfilled) {
                    // console.log("promise getReceivedRequests success: ", fulfilled);
                    var receivedFriendRequests = fulfilled;
                    receivedFriendRequests = receivedFriendRequests.map(function (elt) {
                        return elt._id.toString();
                    });

                    this.setState({ receivedFriendRequests });
                }.bind(this))
                .catch(function (error) {
                    console.log("promise error: ", error);
                });
        }.bind(this);
        getReceivedRequestsPromise();

        const getSentRequests = this.props.getSentRequests();
        var getSentRequestsPromise = function () {
            getSentRequests
                .then(function (fulfilled) {
                    // console.log("promise getSentRequests success: ", fulfilled);
                    var sentFriendRequests = fulfilled;
                    sentFriendRequests = sentFriendRequests.map(function (elt) {
                        return elt._id.toString();
                    });

                    this.setState({ sentFriendRequests });
                }.bind(this))
                .catch(function (error) {
                    console.log("promise error: ", error);
                });
        }.bind(this);
        getSentRequestsPromise();

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
    }

    componentDidUpdate(nextProps, prevState) {
        console.log("ccc componentDidUpdate nextProps: ", nextProps.requests);
        // console.log("derived componentDidUpdate prevState: ", prevState.friendList);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log("prevState: ", prevState.friendList);
        // console.log("ccc derived nextProps: ", nextProps.requests);

        var friendList = [];
        if (nextProps.requests.friends.length > 0) {
            friendList = nextProps.requests.friends;
            friendList.sort(function (a, b) {
                var x = a.username.toLowerCase();
                var y = b.username.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });

            function compareFriendsArrays(a, b) {
                console.log("derived a: ", a);
                console.log("derived b: ", b);
                if (a.length !== b.length) return false;

                else {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].id !== b[i].id) {
                            return false;
                        }
                    }
                }

                return true;
            }


            if (!compareFriendsArrays(friendList, prevState.friendList)) {
                return {
                    friendList: friendList
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        console.log("Dashboard componentWillUnmount");
        // const { socket } = this.props;
        // socket.disconnect();
    }

    connectSocket = () => {
        const socket = io(socketUrl);
        socket.on('connect', function () {
            console.log("Socket connected from Dashboard.js (client)", socket);
        });

        this.setState({ socket });
    }
    disconnectSocket = () => {
        const { socket } = this.state;
        socket.disconnect();
        console.log("socket disconnected: ", socket);
    }


    socketStuff() {
        const { auth } = this.props;
        var { socket } = this.props;
        console.log("Dashboard calling socketStuff()");

        // console.log("socket: ", socket);
        // if (socket === null || socket === undefined || (socket && socket.disconnected)) {
        //     console.log("socket before disconnect (dashboard)", socket);
        //     socket.disconnect();
        //     console.log("Socket was not received from props");
        //     socket = io(socketUrl);
        //     console.log("socket after disconnect (dashboard)", socket);
        //     socket.on('connect', function () {
        //         console.log("Socket connected from dashboard (client)", socket);
        //     });

        //     this.setState({ socket });
        // } else {
        //     console.log("Socket received from props", socket);
        // }

        // this.props.setSocket(socket);

        // if (socket.connected === true) {
        //     console.log("socket connected = true");
        socket.emit('addConnectedUser', auth);
        // } else {
        //     console.log("socket connected = false");
        // }


        socket.on('newMessage', this.addToList);

        // socket.on('createMessage', this.addToList);
        socket.on('createMessage', function (data) {
            this.addToList(data);
        }.bind(this));

        socket.on('updateConnectedUsersList', this.updateConnectedUsersList);
        // socket.on('updateConnectedUsersList', function (data) {
        //     console.log("connected sockets: ", data);
        // });

        // socket.on('receiveUpdateRequests', function (data) {
        //     console.log("receive: ", data);
        // });

        socket.on('updateFriendsList', this.updateFriendsList);

    }

    updateFriendsList() {
        axios.get('api/users/friendslist')
            .then(res => this.setState({ updateFriendsList: res.data }))
            .catch(err => console.log("Error loading friends list: ", err.response.data));
    }


    updateConnectedUsersList = (users) => {
        console.log("Dashboard calling updateConnectedUsersList");
        const { user } = this.props.auth;

        // Need to check if updated is same or not.

        // sort the newly received array ('users' paramter)
        let newArray = Object.assign([], users);
        newArray.sort(function (a, b) {
            var x = a.username.toLowerCase();
            var y = b.username.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });
        // console.log("newArray: ", newArray);

        // console.log("new array: ", newArray);

        // sort the already-existing array which is stored in state
        let arrayInState = this.state.connectedUsersList;
        arrayInState.sort(function (a, b) {
            var x = a.username.toLowerCase();
            var y = b.username.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        if (!this.compareArrays(newArray, arrayInState)) {

            newArray = newArray.filter(function (elt) { return elt.id !== user.id });

            this.setState({ connectedUsersList: newArray });
            // console.log("connected users list updated");
        } else {
            // console.log("connected users list did not need to be updated");
        }

    }

    compareArrays(a, b) {

        if (a.length !== b.length) return false;

        else {
            for (var i = 0; i < a.length; i++) {
                if (a[i].id !== b[i].id) {
                    return false;
                } else if (a[i].socketid !== b[i].socketid) {
                    return false;
                }
            }
        }

        return true;
    }


    addToList = (newData) => {
        // console.log("newData: ", newData);
        if (!newData) return;

        newData.id = this.state.someList.length + 1;
        var list = this.state.someList;
        list.push(newData);
        this.setState({ someList: list });
    }

    createMessage() {
        const { socket } = this.props;
        // socket.emit('disconnect');
        if (!this.state.mText || !(this.state.mText.length > 0)) {
            return this.setState({ error: "Type something" });
        }

        var newData = {
            id: this.state.someList.length + 1,
            text: this.state.someList.length + 1 + ": " + this.state.mText
        }

        // console.log(newData);
        socket.emit('createMessage', newData);
    }

    onSubmit(e) {
        e.preventDefault();

        if (!this.state.mText || !(this.state.mText.length > 0)) {
            return this.setState({ error: "Type something" });
        }

        var newData = {
            id: this.state.someList.length + 1,
            text: this.state.someList.length + 1 + ": " + this.state.mText
        }
        this.addToList(newData);

    }

    onChange(e) {
        this.setState({ error: '' });
        this.setState({ [e.target.name]: e.target.value });
    }

    getSocketNumber = () => {
        const { socket } = this.props;

        socket.emit('socketCount', function (data) {
            console.log("socketCount: ", data);
        })
    }

    sendFriendRequest(recipientId, socketId) {

        // console.log("User ID: ", recipientId);

        const { socket } = this.props;
        var { auth } = this.props;

        var recipientId = { recipientId };

        axios.post('api/users/sendfriendrequest', recipientId)
            .then(res => {
                socket.emit('sendUpdateRequests', socketId);
                // console.log(res.data);

                var sentFriendRequests = res.data;
                sentFriendRequests = sentFriendRequests.map(function (elt) {
                    return elt._id.toString();
                });

                this.setState({ sentFriendRequests });
            })
            .catch(err => console.log(err.response.data));

        // const mFunc = this.props.createFriendRequest({ "recipient": id });
        // var mPromise = function () {
        //     mFunc
        //         .then(function (fulfilled) {
        //             console.log("promise success: ", fulfilled);
        //             // socket.emit()


        //             axios.get('api/users/updaterequests')
        //                 .then(res => {
        //                     socket.emit('sendUpdateRequests', id);
        //                 })
        //                 .catch(err => console.log(err));


        //         })
        //         .catch(function (error) {
        //             console.log("promise error: ", error);
        //         });
        // };

        // mPromise();

        // console.log("freq: ", this.props.createFriendRequest(id));


    }

    render() {
        const { auth } = this.props;
        const { someList, error, connectedUsersList, friendList, sentFriendRequests, receivedFriendRequests } = this.state;

        // console.log("list: ", someList);
        // console.log("list: ", connectedUsersList);
        // console.log("auth: ", this.props);
        return (
            <div>
                <button onClick={this.forceUpdate.bind(this)} type="button">Reload component</button>
                Dashboard
                <form onSubmit={this.onSubmit}>
                    <input onChange={this.onChange} type="text" placeholder="Type here" name="mText"></input>
                    <button type="submit">Add element from client</button>
                    <button type="button" onClick={this.createMessage}>Add element from server</button>
                </form>
                {error.length > 0 ? <span>{error}</span> : null}
                <div className="mList">
                    {someList.length > 0 ? someList.map(elt => (<li key={elt.id}>{elt.text}</li>)) : null}
                </div>

                <div className="friendsAndConnected">
                    <div className="connectedUsersListDiv">
                        {connectedUsersList && connectedUsersList.length > 0 ?
                            <div className="connectedUsersListContainer">
                                <h4>Connected users:</h4>
                                <hr />
                                <ul>
                                    {connectedUsersList.map(user => {
                                        return (
                                            <div key={user.id}>
                                                {/* {auth.user.id !== user.id ? */}
                                                <li className="userElement" >
                                                    username:{user.username}<br />
                                                    id: {user.id}<br />
                                                    socketId: {user.socketid}
                                                    <button
                                                        onClick=

                                                        {receivedFriendRequests.includes(user.id.toString()) ?
                                                            (e) => console.log("button situation: accept friend request")
                                                            :
                                                            // (e) => console.log("button situation: send friend request")
                                                            this.sendFriendRequest.bind(this, user.id, user.socketid)
                                                            // {this.sendFriendRequest.bind(this, user.id, user.socketid)}
                                                        }


                                                        type="button"
                                                        disabled={sentFriendRequests.includes(user.id.toString())
                                                            //  || receivedFriendRequests.includes(user.id.toString())
                                                        }
                                                    >
                                                        {sentFriendRequests.includes(user.id.toString()) || receivedFriendRequests.includes(user.id.toString()) ?
                                                            (receivedFriendRequests.includes(user.id.toString()) ?
                                                                "Accept friend request" :
                                                                "Request sent")
                                                            :
                                                            "Add friend"
                                                        }
                                                    </button>
                                                </li>
                                                {/* : null} */}
                                            </div>

                                        )
                                    })}
                                </ul>
                            </div>
                            : null}
                    </div>

                    <div className="friendListDiv">
                        {friendList && friendList.length > 0 ?
                            <div className="friendListContainer">
                                <h4>Friends:</h4>
                                <hr />
                                <ul className="friendListUL">
                                    {friendList.map(friend => {
                                        return (
                                            <li className="friendElt" key={friend.id}>
                                                <Link
                                                    to=
                                                    {
                                                        friend.handle ?
                                                            `friend/${friend.handle}` :
                                                            `friend/${friend.id}`
                                                    }
                                                    className="friendLink">
                                                    {friend.displayname}
                                                    <div className={classnames("onlineStatus", {
                                                        "online": Boolean(connectedUsersList.find(function (elt) { return elt.id.toString() === friend.id.toString() }))
                                                    })}></div>
                                                </Link>
                                            </li>

                                        )
                                    }
                                    )}
                                </ul>
                            </div>
                            : null}
                    </div>
                </div>

                <button type="button" onClick={this.getSocketNumber}>Socket count</button>
                <button type="button" onClick={this.connectSocket}>Connect Socket</button>
                <button type="button" onClick={this.disconnectSocket}>Disonnect Socket</button>
            </div>
        )
    }
}

Dashboard.propTypes = {
    createFriendRequest: PropTypes.func.isRequired,
    getRequests: PropTypes.func.isRequired,
    getSentRequests: PropTypes.func.isRequired,
    getFriends: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    requests: PropTypes.object,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    requests: state.requests,
})


export default connect(mapStateToProps, { createFriendRequest, getRequests, getFriends, getSentRequests })(Dashboard);
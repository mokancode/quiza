// This file pertains to the postponed Friends freature of Quiza.

import axios from 'axios';
import { GET_FRIEND_REQUESTS, GET_REQUESTS, GET_SENT_REQUESTS, GET_FRIENDS } from './types';

// Get friends list
export const getFriends = () => dispatch => {
    return new Promise(
        function (resolve, reject) {
            axios.get('/api/users/friends')
                .then(res => {
                    var friendList = res.data;
                    var friendNames = [];
                    // console.log("promise friendList", friendList);
                    Promise.all(friendList.map((friend, index) => {
                        axios.get(`/api/users/getfriendname/${friend._id}`)
                        .then(friendName => {
                            // console.log("promise friendNames", friendNames);
                                // console.log("username of friend requester: ", res.data);
                                friendNames.push(friendName.data);
                                if (index === friendList.length - 1) {
                                    setTimeout(() => {
                                        dispatch({
                                            type: GET_FRIENDS,
                                            payload: friendNames
                                        })
                                        resolve(friendNames)
                                    }, 200);
                                }
                            })
                            .catch(err => {
                                // console.log("promise ERROR", err.response.data);
                            })
                    })) // promise.all
                    // dispatch({
                    //     type: GET_FRIENDS,
                    //     payload: res.data
                    // });
                })
                .catch(err => console.log("Error fetching friends list: ", err.response.data));
        } // resolve/reject
    ) // new promise
}

// Get all requests
export const getRequests = () => dispatch => {
    return new Promise(
        function (resolve, reject) {
            axios.get('/api/users/getrequests')
                .then(res => {
                    dispatch({
                        type: GET_REQUESTS,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("Error getting requests: ", err.response.data);
                    reject([]);
                })
        })
}

// Get all sent requests
export const getSentRequests = () => dispatch => {
    return new Promise(
        function (resolve, reject) {
            axios.get('/api/users/getsentrequests')
                .then(res => {
                    dispatch({
                        type: GET_SENT_REQUESTS,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    // console.log("Error getting requests: ", err.response.data);
                    console.log("Error getting sent requests: ", err);
                    reject([]);
                })
        })
}


// Get all friend requests
export const getFriendRequests = (friendRequests) => dispatch => {
    return new Promise(
        function (resolve, reject) {
            var frq = [];
            Promise.all(friendRequests.map((friendRequest, index) => {
                axios.post('/api/users/getfriendrequests', { requesterId: friendRequest._id })
                    .then(res => {
                        // console.log("username of friend requester: ", res.data);
                        frq.push(res.data);
                        // this.setState({ friendRequestsNames: frq })

                        // console.log("Promise", res.data);
                        // localStorage.setItem('numberOfFriendRequests', frq.length);

                        // console.log("username: ", res.data.username);
                        if (index === friendRequests.length - 1) {
                            setTimeout(() => {
                                dispatch(setFriendRequests(frq));
                                // this.setState({ friendRequestsNames: frq }); 

                                resolve(frq)

                            }, 200);
                        }
                    })
                    .catch(err => console.log(err.response.data));
            }))
        } // resolve/reject
    ) // new Promise
} // getFriendRequests

export const setFriendRequests = (requests) => {
    return {
        type: GET_FRIEND_REQUESTS,
        payload: requests
    }
}


// (Recipient will) Reject friend request
export const rejectFriendRequest = (userId) => dispatch => {
    return new Promise(
        function (resolve, reject) {
            axios.delete(`api/users/rejectfriendrequest/${userId}`)
                .then(res => {
                    dispatch({
                        type: GET_REQUESTS,
                        payload: res.data
                    })
                    resolve("success");
                })
                .catch(err => {
                    // console.log("Error rejecting friend request: ", err.response.data)
                    console.log("Error rejecting friend request: ", err)
                    reject("failed");
                });
        })
}

// (Recipient will) Accept friend request
export const acceptFriendRequest = (userId) => dispatch => {
    return new Promise(
        function (resolve, reject) {
            axios.post(`api/users/acceptfriendrequest/${userId}`)
                .then(res => {
                    dispatch({
                        type: GET_REQUESTS,
                        payload: res.data
                    })
                    resolve("success");
                })
                .catch(err => {
                    // console.log("Error rejecting friend request: ", err.response.data)
                    console.log("Error accepting friend request: ", err)
                    reject("failed");
                });
        })
}
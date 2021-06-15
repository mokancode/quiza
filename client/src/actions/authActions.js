import axios from 'axios';
import { SET_CURRENT_USER, GET_ERRORS } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { resolve } from 'url';
import { rejects } from 'assert';

// Login user - Get user (JWT) token
export const loginUser = (userData, socket) => dispatch => {
    return new Promise(
        function (resolve, reject) {
            return axios.post('/api/users/login', userData)
                .then(res => {

                    // console.log("socket from authActions: ", socket);
                    // if (socket) {
                    // throw { response: { data: { password: "User already logged in" } } }
                    // }
                    // Get token from response
                    const { token } = res.data;
                    // Save token to localStorage
                    localStorage.setItem('jwtToken', token);
                    // Set token to Authorization header
                    setAuthToken(token);
                    // Decode token to get user data
                    const decoded = jwt_decode(token);
                    // Set current user
                    // console.log("decoded: ", decoded);
                    dispatch(setCurrentUser(decoded));
                    resolve(true);
                })
                .catch(err => {
                    // console.log("login err", err);

                    console.log("login auth error: ", err.response.data)
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    })
                    reject(err.response.data);
                });
        })
}

// Set logged-in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log user out
export const logoutUser = (socket) => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will also set isAuthenticated to false
    dispatch(setCurrentUser({}));
    localStorage.setItem('STORAGE_KEY', JSON.stringify({}));

    // socket.disconnect();
    // console.log("Socket disconnected: ", socket);
}

// export const createFriendRequest = recipient => dispatch => {
//     return new Promise(
//         function (resolve, reject) {
//             // dispatch(clearErrors());
//             axios.post('/api/users/sendfriendrequest', recipient)
//                 .then(res => {
//                     resolve(res.data);
//                 })
//                 .catch(err => {
//                     dispatch({
//                         type: GET_ERRORS,
//                         payload: err.response.data
//                     })
//                     reject(err.response.data);
//                 })
//         })
// }

// Request a password-reset token to be send to user's email. Accepts username and/or email.
export const requestPasswordReset = userData => dispatch => {
    return new Promise(
        function (resolve, reject) {
            // dispatch(clearErrors());
            axios.post('/api/users/requestpasswordreset', userData)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    // dispatch({
                    //     type: GET_ERRORS,
                    //     payload: err.response.data
                    // })
                    reject(err.response.data);
                })
        })
}

// Reset password. Accepts 3 parameters: user ID (decoded from token in URL query), the new password and a password confirmation.
export const resetPassword = userData => dispatch => {
    return new Promise(
        function (resolve, reject) {
            // dispatch(clearErrors());
            axios.post('/api/users/resetpassword', userData)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    // dispatch({
                    //     type: GET_ERRORS,
                    //     payload: err.response.data
                    // })
                    reject(err.response.data);
                })
        })
}
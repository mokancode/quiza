import axios from 'axios';
import { SEARCH_QUIZZES, GET_MAJORS, GET_TEACHERS, SET_DRAFT, GET_MY_QUIZZES, CLEAR_MY_QUIZZES, NOTIFY_REVIEW_UPDATE } from './types';
import isEmpty from '../validation/is-empty';

// Get quizzes by search parameters
export const searchQuizzes = function (quizData) {
    return function (dispatch) {
        try {
            return new Promise(
                function (resolve, reject) {
                    axios.post("/api/quizzes/searchquizzes/", quizData)
                        .then(res => {
                            // console.log("quiz search succesful: ", res.data);
                            dispatch({
                                type: SEARCH_QUIZZES,
                                payload: res.data
                            })
                            resolve(res.data);
                        })
                        .catch(err => {
                            dispatch({
                                type: SEARCH_QUIZZES,
                                payload: []
                            })
                            // console.log("Error rejecting friend request: ", err.response.data)
                            console.log("Error searching quiz: ", err.response.data)
                            reject(err.response.data);
                        });
                })
        } catch (err) {
            console.log("quiz actions searchQuizzes error: ", err);
        }
    }
}

// Get a list of fields of studies (i.e. majors) from the server
export const getMajors = function () {
    return function (dispatch) {
        try {
            return new Promise(function (resolve, reject) {
                axios.get('/api/majors/getmajors')
                    .then(function (res) {
                        resolve(res);
                        dispatch({
                            type: GET_MAJORS,
                            payload: res.data
                        })
                    })
                    .catch(function (err) {
                        reject(err);
                        dispatch({
                            type: GET_MAJORS,
                            payload: null
                        })
                        // let { errors } = this.state;
                        // errors.fieldsofstudy = "Cannot fetch fields of study";
                        // return this.setState({ errors });
                    })
            })
        } catch (err) {

        }
    }
}

// Get a list of teacher names from existing quizzes
export const getTeachers = function () {
    return function (dispatch) {
        return axios.get('/api/quizzes/getteachers')
            .then(function (res) {
                dispatch({
                    type: GET_TEACHERS,
                    payload: res.data
                })
            })
            .catch(function (err) {
                dispatch({
                    type: GET_TEACHERS,
                    payload: null
                })
                // let { errors } = this.state;
                // errors.fieldsofstudy = "Cannot fetch fields of study";
                // return this.setState({ errors });
            })
    }
}

// Set the quiz draft object from MyQuizzes in global state
export const setQuizDraft = function (draft) {
    return function (dispatch) {
        dispatch({
            type: SET_DRAFT,
            payload: draft
        })
    }
}

// Get a list of current user's quizzes
export const getMyQuizzes = function (myQuizzes) {
    return function (dispatch) {
        if (!isEmpty(myQuizzes)) {
            dispatch({
                type: GET_MY_QUIZZES,
                payload: myQuizzes
            })
        }
        else {
            return axios.get('/api/quizzes/getmyquizzes')
                .then(function (res) {
                    dispatch({
                        type: GET_MY_QUIZZES,
                        payload: res.data
                    })
                })
                .catch(function (err) {
                    dispatch({
                        type: GET_MY_QUIZZES,
                        payload: null
                    })
                })
        }
    }
}

/* 
   Let the app know if the user has updated their review on a certain quiz, so the next time they load the reviews
   the app will load the updated data
*/
export const notifyReviewUpdate = function (operation) {
    return function (dispatch) {
        dispatch({
            type: NOTIFY_REVIEW_UPDATE,
            payload: operation
        })
    }
}

// Clear the list of current user's quizzes
export const clearMyQuizzes = function () {
    return function (dispatch) {
        dispatch({
            type: CLEAR_MY_QUIZZES,
            payload: []
        })
    }
}
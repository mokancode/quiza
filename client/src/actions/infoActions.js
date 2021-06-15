import { ADD_INFO_MESSAGE, REMOVE_INFO_MESSAGE } from './types';

// Add info message to feed
export function addInfoMessage(infoMessage) {
    return function (dispatch) {
        dispatch({
            type: ADD_INFO_MESSAGE,
            payload: infoMessage
        })
    }
}

// Remove info message from feed
export function removeInfoMessage(infoMessage) {
    return function (dispatch) {
        dispatch({
            type: REMOVE_INFO_MESSAGE,
            payload: null
        })
    }
}
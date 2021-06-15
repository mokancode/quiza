import { GET_FRIEND_REQUESTS, GET_REQUESTS, GET_FRIENDS, GET_SENT_REQUESTS } from "../actions/types";

const initialState = {
  requests: [],
  friendRequests: [],
  friends: [],
  sentrequests: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
      };

    case GET_SENT_REQUESTS:
      return {
        ...state,
        sentrequests: action.payload,
      };

    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
      };

    case GET_FRIEND_REQUESTS:
      return {
        ...state,
        friendRequests: action.payload,
      };
    default:
      return state;
  }
}

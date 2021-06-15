import { ADD_INFO_MESSAGE, REMOVE_INFO_MESSAGE } from "../actions/types";

const initialState = {
  // infoMessageFeed: []
  infoMessageFeed: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_INFO_MESSAGE:
      // var updatedFeed = initialState.infoMessageFeed;
      // updatedFeed.push(action.payload);
      return {
        ...state,
        // infoMessageFeed: updatedFeed
        infoMessageFeed: action.payload,
      };

    case REMOVE_INFO_MESSAGE:
      return {
        ...state,
        infoMessageFeed: null,
      };

    default:
      return state;
  }
}

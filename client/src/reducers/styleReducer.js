import { NAVBAR_SHADOW } from "../actions/types";

const initialState = {
  navbarShadow: "dark",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NAVBAR_SHADOW:
      return {
        ...state,
        navbarShadow: action.payload,
      };
    default:
      return state;
  }
}

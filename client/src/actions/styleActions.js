import { NAVBAR_SHADOW } from "./types";

// Change shadow color
export function changeNavbarShadow(shadowColor) {
  return function (dispatch) {
    return setTimeout(function () {
      dispatch({
        type: NAVBAR_SHADOW,
        payload: shadowColor,
      });
    }, 5000);
  };
}

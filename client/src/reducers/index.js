import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import quizReducer from "./quizReducer";
import styleReducer from "./styleReducer";
import infoReducer from "./infoReducer";
// import requestReducer from './requestReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  quizzes: quizReducer,
  styles: styleReducer,
  infoMsgs: infoReducer,
  // requests: requestReducer,
});

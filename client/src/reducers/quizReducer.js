import {
  SEARCH_QUIZZES,
  GET_MAJORS,
  GET_TEACHERS,
  SET_DRAFT,
  GET_MY_QUIZZES,
  CLEAR_MY_QUIZZES,
  NOTIFY_REVIEW_UPDATE,
} from "../actions/types";

const initialState = {
  quizzes: [],
  fieldsOfStudyList: [],
  teachersList: [],
  draft: null,
  createQuizUnmounted: false,
  myQuizzes: [],
  notifyReviewUpdate: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SEARCH_QUIZZES:
      return {
        ...state,
        quizzes: action.payload,
      };
    case GET_MAJORS:
      return {
        ...state,
        fieldsOfStudyList: action.payload,
      };
    case GET_TEACHERS:
      return {
        ...state,
        teachersList: action.payload,
      };
    case SET_DRAFT:
      return {
        ...state,
        draft: action.payload,
      };
    case GET_MY_QUIZZES:
      return {
        ...state,
        myQuizzes: action.payload,
      };
    case CLEAR_MY_QUIZZES:
      return {
        ...state,
        myQuizzes: action.payload,
      };
    case NOTIFY_REVIEW_UPDATE:
      return {
        ...state,
        notifyReviewUpdate: action.payload,
      };
    default:
      return state;
  }
}

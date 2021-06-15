import isEmpty from "./is-empty";

export default function compareQuizzes(quiz1, quiz2) {
  /* 
        quiz1 = props.
        quiz2 = state.
        true means quizzes are the same, no need to update

    */
  if (isEmpty(quiz2)) return false;
  else {
    if (quiz1._id !== quiz2._id) return false;
  }

  return true;
}
// module.exports = compareQuizzes;

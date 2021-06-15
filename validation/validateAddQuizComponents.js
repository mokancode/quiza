const Validator = require("validator");
const isEmpty = require("./is-empty");
const mTrim = require("./mTrim");
const { v4: generateUniqueID } = require("uuid");

module.exports = function validateAddQuizComponents(data) {
  let errors = {};
  errors.questionErrors = [];

  // quizName, teacherName, courseBody, schoolBody, majorBody, questionsList, quizCreatorName, quizTerm

  /*
        quizName must consist of alphanumeric chars only and be of length upto 70.
        teacherName is optional. If not empty, must consist of letters and be between 2 and 40 chars.
        courseBody contains letters, digits, and title.
            Letters must be between 2 and 10 chars.
            Digits must be between 1 and 5 chars.
            Title must be alphanumeric and between 5 and 70 characters
        schoolBody contains name only at this stage, may contain letters and digits, and be between 5 and 70 characters.
        majorBody contains name only at this stage, may contain letters only, and be between 1 and 30 characters.
        quizCreatorName may contain numbers and digits and must be between 5 to 20 characters.
        quizTerm is optional. However if it's not empty, it must consist both season and year. Season must match one of the four strings:
        Summer, Fall, Winter, Spring. While the year has to match 2010/1/2/3/4/5/6/7/8/9
        
        questionsList is a relatively more complex component/object than the others.
        Criteria:
            Must contain at least 2 members in the array.
            Each member MUST meet the following criteria: {
                contain at least 2 members (question and potentialAnswers array)
                question: must be typeof = string
                potentialAnswers: [
                    must contain at least 2 members, where each has:
                        potentialAnswer: type: string,
                        correctAnswer: type: boolean
                ],

            }
    */

  data.quizName = !isEmpty(data.quizName) ? data.quizName : "";
  data.teacherName = !isEmpty(data.teacherName) ? data.teacherName : "";
  data.courseBody.letters = !isEmpty(data.courseBody.letters) ? data.courseBody.letters : "";
  data.courseBody.digits = !isEmpty(data.courseBody.digits) ? data.courseBody.digits : "";
  data.courseBody.title = !isEmpty(data.courseBody.title) ? data.courseBody.title : "";
  data.schoolBody.name = !isEmpty(data.schoolBody.name) ? data.schoolBody.name : "";
  data.majorBody.name = !isEmpty(data.majorBody.name) ? data.majorBody.name : "";
  data.quizCreatorName = !isEmpty(data.quizCreatorName) ? data.quizCreatorName : "";
  data.quizTerm = !isEmpty(data.quizTerm) ? data.quizTerm : {};

  // If I remove the illegal characters, will validation still return false? If so, reject the string.
  if (isEmpty(data.quizName) || !Validator.isLength(data.quizName, { min: 5, max: 70 })) {
    errors.quizName = "Quiz name must be between 5 and 70 characters";
  } else {
    var tempStr = data.quizName;
    tempStr = tempStr.replace(new RegExp("[.]+", "ig"), "");
    tempStr = tempStr.replace(new RegExp("[,]+", "ig"), "");
    tempStr = tempStr.replace(new RegExp("[']+", "ig"), "");
    tempStr = tempStr.replace(new RegExp('["]+', "ig"), "");
    tempStr = tempStr.replace(new RegExp("[(]+", "ig"), "");
    tempStr = tempStr.replace(new RegExp("[)]+", "ig"), "");
    tempStr = tempStr.replace(new RegExp("[/]+", "ig"), "");

    var mBool = tempStr.match(new RegExp(/[^A-z0-9,.\(\)\'\"\s]/gi));

    if (!isEmpty(mBool)) {
      errors.quizName = "Quiz name may only contain letters, digits, commas, periods, quotation marks, parenthesis, and forward slashes";
    } else {
      // correct
      // data.quizName = data.quizName.replace(new RegExp("[.]+", "ig"), "\.");
      // data.quizName = data.quizName.replace(new RegExp("[,]+", "ig"), "\,");
      // data.quizName = data.quizName.replace(new RegExp("[\']+", "ig"), "\'");
      // data.quizName = data.quizName.replace(new RegExp("[\"]+", "ig"), "\"");
      // data.quizName = data.quizName.replace(new RegExp("[\(]+", "ig"), "\(");
      // data.quizName = data.quizName.replace(new RegExp("[\)]+", "ig"), "\)");
      // data.quizName = data.quizName.replace(new RegExp("[\/]+", "ig"), "\/");
      data.quizName = mTrim(data.quizName).trim();
    }
  }
  if (!isEmpty(data.teacherName) && (!Validator.isLength(data.teacherName, { min: 2, max: 40 }) || data.teacherName.match(/[^A-z\s]/gi))) {
    errors.teacherName = "Teacher name may include 2 to 40 letters only";
  }
  if (isEmpty(data.courseBody.letters) || !Validator.isLength(data.courseBody.letters, { min: 2, max: 10 })) {
    errors.courseCodeLetters = "Code must include 2 to 10 letters";
  } else {
    data.courseBody.letters = data.courseBody.letters.toUpperCase();
  }
  if (!isEmpty(data.courseBody.letters) && data.courseBody.letters.match(/[^A-z]/gi)) {
    errors.courseCodeLettersOnly = "Letters only";
  }
  if (isEmpty(data.courseBody.digits) || !Validator.isLength(data.courseBody.digits, { min: 1, max: 5 })) {
    errors.courseCodeDigits = "Code must include 1 to 5 digits";
  }
  if (!isEmpty(data.courseBody.digits) && data.courseBody.digits.match(/[^0-9]/gi)) {
    errors.courseCodeDigitsOnly = "Digits only";
  }
  if (
    (isEmpty(data.courseBody.digits) && !isEmpty(data.courseBody.letters)) ||
    (!isEmpty(data.courseBody.digits) && isEmpty(data.courseBody.letters))
  ) {
    errors.courseCodeBothError = "Both letters and digits are required";
  }
  if (data.courseBody.title.match(/[^A-z0-9\s]/gi) || !Validator.isLength(data.courseBody.title, { min: 5, max: 70 })) {
    errors.courseTitle = "Title may contain letters and numbers only and must contain between 5 and 70 characters";
  }
  if (data.schoolBody.name.match(/[^A-z0-9\s]/gi) || !Validator.isLength(data.schoolBody.name, { min: 5, max: 70 })) {
    errors.schoolName = "School name must contain between 5 and 70 letters and/or numbers only";
  } else {
    // correct
    data.schoolBody.name = mTrim(data.schoolBody.name).trim();
    data.schoolBody.name = data.schoolBody.name.replace(new RegExp("college", "ig"), "College");
    data.schoolBody.name = data.schoolBody.name.replace(new RegExp("university", "ig"), "University");
    data.schoolBody.name = data.schoolBody.name[0].toUpperCase() + data.schoolBody.name.substring(1, data.schoolBody.name.length);
  }
  if (data.majorBody.name.match(/[^A-z\s]/gi) && !Validator.isLength(data.majorBody.name, { min: 1, max: 30 })) {
    errors.majorName = "Major name may contain letters only and must contain between 1 to 30 characters";
  }
  if (isEmpty(data.majorBody.name)) {
    errors.majorName = "Field of study is required";
  }
  if (data.quizCreatorName.match(/[^A-z\_0-9\s]/gi) || !Validator.isLength(data.quizCreatorName, { min: 1, max: 20 })) {
    errors.quizCreatorName = "Quiz creator name may contain letters and digits only and must contain between 5 to 20 characters";
  }
  if (!isEmpty(data.quizTerm)) {
    if (
      (!isEmpty(data.quizTerm.season) && isEmpty(data.quizTerm.year) && !Object.keys(data.quizTerm).includes("Season")) ||
      (isEmpty(data.quizTerm.season) && !isEmpty(data.quizTerm.year) && !Object.keys(data.quizTerm).includes("Year"))
    )
      errors.quizTerm = "Term must include both year and season";
    else {
      if (!data.quizTerm.season === ("Summer" || "Fall" || "Winter" || "Spring")) errors.quizTerm = "Invalid term season";
      if (!isEmpty(data.quizTerm.year) && !data.quizTerm.year.match(/201[0-9]/gi)) errors.quizTerm = "Invalid term year";
    }
  }
  if (isEmpty(data.questionsList) || data.questionsList.length < 2) {
    errors.questionsList = "Add at least 2 questions to create a quiz";
  } else if (!isEmpty(data.questionsList) && data.questionsList.length > 200) {
    errors.questionsList = "Limit of 200 questions has been surpassed";
  } else {
    for (var i = 0; i < data.questionsList.length; i++) {
      var qElt = data.questionsList[i];
      if (!Object.keys(qElt).includes("question")) {
        errors.questionsList = `Question at index ${i} is missing the question itself`;
      } else if (typeof qElt.question != "string") errors.questionsList = `Question must be a string. Error occured at question index ${i}`;
      else if (isEmpty(qElt.question)) {
        errors.questionErrors.push({ id: generateUniqueID(), error: `Question ${i + 1} is missing the question text` });
      } else if (qElt.question.replace(new RegExp("\n", "g"), "").length > 500) {
        errors.questionErrors.push({ id: generateUniqueID(), error: `Question ${i + 1}'s length is over the 500 character limit` });
      }

      if (!Object.keys(qElt).includes("potentialAnswers")) {
        errors.questionsList = `Question at index ${i} is missing its answer list`;
      } else {
        if (qElt.potentialAnswers.length < 2) {
          errors.questionsList = `Question index ${i} is has less than 2 answers`;
        } else if (qElt.potentialAnswers.length > 10) {
          errors.questionsList = `Question ${i + 1} has surpassed 10 answers limit`;
        } else {
          var correctAnswerExists = 0; // 0 = no, 1 = yes. Int over boolean because there must be only 1 correct answer.
          for (var k = 0; k < qElt.potentialAnswers.length; k++) {
            var answersElt = qElt.potentialAnswers[k];

            if (!Object.keys(answersElt).includes("potentialAnswer")) {
              errors.questionsList = `Answer element at index ${k} of question index ${i} is missing a potentialAnswer`;
            } else if (typeof answersElt.potentialAnswer != "string") {
              errors.questionsList = `potentialAnswer of Answer element at index ${k} of question index ${i} is not a string, but should be.`;
            } else if (isEmpty(answersElt.potentialAnswer)) {
              errors.questionErrors.push({
                id: generateUniqueID(),
                error: `Answer ${String.fromCharCode(k + 1 + 64)} of question ${i + 1} is empty`,
              });
            } else if (answersElt.potentialAnswer.length > 500) {
              errors.questionErrors.push({
                id: generateUniqueID(),
                error: `Answer ${String.fromCharCode(k + 1 + 64)} of question ${i + 1}'s length is over the 500 character limit`,
              });
            }
            if (!Object.keys(answersElt).includes("correctAnswer")) {
              errors.questionsList = `Answer element at index ${k} of question index ${i} is missing a correctAnswer`;
            } else if (!(answersElt.correctAnswer.toString() === "true" || answersElt.correctAnswer.toString() === "false")) {
              errors.questionsList = `correctAnswer of Answer element at index ${k} of question index ${i} is not a boolean, but should be.`;
            }
            // else if (isEmpty(answersElt.correctAnswer)) {
            //     errors.questionErrors.push({id:generateUniqueID(), error:`A correct answer was not set for question ${i + 1}`});
            // }
            else if (!isEmpty(answersElt.correctAnswer) && (answersElt.correctAnswer === true || answersElt.correctAnswer === "true")) {
              correctAnswerExists++;
            }
          }
          if (correctAnswerExists !== 1) {
            errors.questionErrors.push({ id: generateUniqueID(), error: `A correct answer was not set for question ${i + 1}` });
          }
        }
      }
    }
  }

  // else {
  //     for (var i = 0; i < data.questionsList.length; i++) {
  //         var qElt = data.questionsList[i];
  //         if (!Object.keys(qElt).includes("question")) {
  //             errors.questionsList = `Question at index ${i} is missing the question itself`;
  //         } else if (typeof (qElt.question) != "string") errors.questionsList = `Question must be a string. Error occured at question index ${i}`;

  //         if (!Object.keys(qElt).includes("potentialAnswers")) {
  //             errors.questionsList = `Question at index ${i} is missing its answer list`;
  //         } else {
  //             if (qElt.potentialAnswers.length < 2) {
  //                 errors.questionsList = `Question index ${i} is has less than 2 answers`;
  //             }

  //             else {
  //                 for (var k = 0; k < qElt.potentialAnswers.length; k++) {
  //                     var answersElt = qElt.potentialAnswers[k];

  //                     if (!Object.keys(answersElt).includes("potentialAnswer")) {
  //                         errors.questionsList = `Answer element at index ${k} of question index ${i} is missing a potentialAnswer`;
  //                     } else if (typeof (answersElt.potentialAnswer) != ("string")) {
  //                         errors.questionsList = `potentialAnswer of Answer element at index ${k} of question index ${i} is not a string, but should be.`;
  //                     }
  //                     if (!Object.keys(answersElt).includes("correctAnswer")) {
  //                         errors.questionsList = `Answer element at index ${k} of question index ${i} is missing a correctAnswer`;
  //                     } else if (!(answersElt.correctAnswer.toString() === "true" || answersElt.correctAnswer.toString() === "false")) {
  //                         errors.questionsList = `correctAnswer of Answer element at index ${k} of question index ${i} is not a boolean, but should be.`;
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // }

  if (isEmpty(errors.questionErrors) && errors.questionErrors.length === 0) {
    delete errors.questionErrors;
  }

  return {
    errors,
    data,
    isValid: isEmpty(errors),
  };
};

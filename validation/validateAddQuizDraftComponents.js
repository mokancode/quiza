const Validator = require('validator');
const isEmpty = require('./is-empty');
const mTrim = require('./mTrim');

module.exports = function validateAddQuizDraftComponents(data) {
    let errors = {};

    // quizName, teacherName, courseBody, schoolBody, majorBody, questionsList, quizCreatorName, quizTerm

    /*
        Unlike validateAddQuizComponents, this function does not require minimums. It only enforces maximum length.
    
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

    data.quizName = !isEmpty(data.quizName) ? data.quizName : '';
    data.teacherName = !isEmpty(data.teacherName) ? data.teacherName : '';
    data.courseBody.letters = !isEmpty(data.courseBody.letters) ? data.courseBody.letters : '';
    data.courseBody.digits = !isEmpty(data.courseBody.digits) ? data.courseBody.digits : '';
    data.courseBody.title = !isEmpty(data.courseBody.title) ? data.courseBody.title : '';
    data.schoolBody.name = !isEmpty(data.schoolBody.name) ? data.schoolBody.name : '';
    data.majorBody.name = !isEmpty(data.majorBody.name) ? data.majorBody.name : '';
    data.quizCreatorName = !isEmpty(data.quizCreatorName) ? data.quizCreatorName : '';
    data.quizCreatorId = !isEmpty(data.quizCreatorId) ? data.quizCreatorId : '';
    data.quizTerm = !isEmpty(data.quizTerm) ? data.quizTerm : {};

    // If I remove the illegal characters, will validation still return false? If so, reject the string.
    if (!isEmpty(data.quizName) && !Validator.isLength(data.quizName, { min: 0, max: 70 })) {
        // errors.quizName = "Quiz name must be between 5 and 70 characters";
        data.quizName = data.quizName.substring(0, 70);
    } else {
        var tempStr = data.quizName;
        tempStr = tempStr.replace(new RegExp("[.]+", "ig"), "");
        tempStr = tempStr.replace(new RegExp("[,]+", "ig"), "");
        tempStr = tempStr.replace(new RegExp("[\']+", "ig"), "");
        tempStr = tempStr.replace(new RegExp("[\"]+", "ig"), "");
        tempStr = tempStr.replace(new RegExp("[\(]+", "ig"), "");
        tempStr = tempStr.replace(new RegExp("[\)]+", "ig"), "");
        tempStr = tempStr.replace(new RegExp("[\/]+", "ig"), "");

        var mBool = tempStr.match(new RegExp(/[^A-z0-9,.\(\)\'\"\s]/ig));

        if (!isEmpty(mBool)) {
            // errors.quizName = "Quiz name may only contain letters, digits, commas, periods, quotation marks, parenthesis, and forward slashes";
        } else {
            // correct
            // data.quizName = data.quizName.replace(new RegExp("[.]+", "ig"), "\.");
            // data.quizName = data.quizName.replace(new RegExp("[,]+", "ig"), "\,");
            // data.quizName = data.quizName.replace(new RegExp("[\']+", "ig"), "\'");
            // data.quizName = data.quizName.replace(new RegExp("[\"]+", "ig"), "\"");
            // data.quizName = data.quizName.replace(new RegExp("[\(]+", "ig"), "\(");
            // data.quizName = data.quizName.replace(new RegExp("[\)]+", "ig"), "\)");
            // data.quizName = data.quizName.replace(new RegExp("[\/]+", "ig"), "\/");
            // data.quizName = mTrim(data.quizName).trim();
        }
        data.quizName = mTrim(data.quizName).trim();
    }
    if (!isEmpty(data.teacherName) && (!Validator.isLength(data.teacherName, { min: 0, max: 40 }) || data.teacherName.match(/[^A-z\s]/ig))) {
        // errors.teacherName = "Teacher name may include 2 to 40 letters only";
        data.teacherName = data.teacherName.substring(0, 40);
    }
    if (!isEmpty(data.courseBody.letters) && !Validator.isLength(data.courseBody.letters, { min: 0, max: 10 })) {
        // errors.courseCodeLetters = "Code must include 2 to 10 letters";
        data.courseBody.letters = data.courseBody.letters.substring(0, 10);
        data.courseBody.letters = data.courseBody.letters.toUpperCase();
    } else {
        data.courseBody.letters = ""
    }

    if (!isEmpty(data.courseBody.digits) && !Validator.isLength(data.courseBody.digits, { min: 0, max: 5 })) {
        // errors.courseCodeDigits = "Code must include 1 to 5 digits";
        data.courseBody.digits = data.courseBody.digits.substring(0, 5);
    } else {
        data.courseBody.digits = ""
    }

    if (data.courseBody.title.match(/[^A-z0-9\s]/ig) || !Validator.isLength(data.courseBody.title, { min: 0, max: 70 })) {
        // errors.courseTitle = "Title may contain letters and numbers only and must contain between 5 and 70 characters";
        data.courseTitle = data.courseTitle.substring(0, 70);
    }
    if (data.schoolBody.name.match(/[^A-z0-9\s]/ig) || !Validator.isLength(data.schoolBody.name, { min: 0, max: 70 })) {
        // errors.schoolName = "School name must contain between 5 and 70 letters and/or numbers only";
        
        data.schoolBody.name = mTrim(data.schoolBody.name).trim();
        data.schoolBody.name = data.schoolBody.name.replace(new RegExp("college", "ig"), "College");
        data.schoolBody.name = data.schoolBody.name.replace(new RegExp("university", "ig"), "University");
        data.schoolBody.name = data.schoolBody.name[0].toUpperCase() + data.schoolBody.name.substring(1, data.schoolBody.name.length);
        data.schoolTitle = data.schoolTitle.substring(0, 70);
    } 
    
    if (data.majorBody.name.match(/[^A-z\s]/ig) || !Validator.isLength(data.majorBody.name, { min: 0, max: 30 })) {
        // errors.majorName = "Major name may contain letters only and must contain between 1 to 30 characters";
        data.majorName = data.majorName.substring(0, 30);
    }
    if (data.quizCreatorName.match(/[^A-z\_0-9\s]/ig) || !Validator.isLength(data.quizCreatorName, { min: 0, max: 20 })) {
        // errors.quizCreatorName = "Quiz creator name may contain letters and digits only and must contain between 5 to 20 characters";
        data.quizCreatorName = data.quizCreatorName.substring(0, 20);
    }

    if (!isEmpty(data.quizTerm)) {
        if (!data.quizTerm.season === ("Summer" || "Fall" || "Winter" || "Spring")) {
            // errors.quizTerm = "Invalid term season";
            data.quizTerm.season = '';
        }
        if (!isEmpty(data.quizTerm.year) && !data.quizTerm.year.match(/201[0-9]/ig)) {
            // errors.quizTerm = "Invalid term year";
            data.quizTerm.year = '';
        }
    }
    if (!isEmpty(data.questionsList)) {
        // errors.questionsList = "Please create at least 2 questions";

        for (var i = 0; i < data.questionsList.length; i++) {
            var qElt = data.questionsList[i];
            if (typeof (qElt.question) != "string") data.questionsList[i].question = '';

            for (var k = 0; k < qElt.potentialAnswers.length; k++) {
                var answersElt = qElt.potentialAnswers[k];

                if (!Object.keys(answersElt).includes("potentialAnswer")) {
                    // errors.questionsList = `Answer element at index ${k} of question index ${i} is missing a potentialAnswer`;
                    data.questionsList[i].potentialAnswers[k] = {};
                } else if (typeof (answersElt.potentialAnswer) != ("string")) {
                    // errors.questionsList = `potentialAnswer of Answer element at index ${k} of question index ${i} is not a string, but should be.`;
                    data.questionsList[i].potentialAnswers[k].potentialAnswer = '';

                }
                if (!Object.keys(answersElt).includes("correctAnswer")) {
                    // errors.questionsList = `Answer element at index ${k} of question index ${i} is missing a correctAnswer`;
                    data.questionsList[i].potentialAnswers[k].correctAnswer = null;
                } else if (!(answersElt.correctAnswer.toString() === "true" || answersElt.correctAnswer.toString() === "false")) {
                    // errors.questionsList = `correctAnswer of Answer element at index ${k} of question index ${i} is not a boolean, but should be.`;
                    data.questionsList[i].potentialAnswers[k].correctAnswer = null;
                }
            }


        }
    }


    return {
        errors,
        data
        // isValid: isEmpty(errors)
    }
}
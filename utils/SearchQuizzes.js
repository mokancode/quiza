const metaphone = require('metaphone');
const isEmpty = require('../validation/is-empty');

module.exports = function searchQuizzes(quizzes, courseId, majorId, schoolId, quizTerm, quizCreatorName, searchableId, users) {

    // First filter out all quizzes which are not currently a draft
    var searchResults = quizzes.filter(quiz => {
        try {
            if (isEmpty(quiz.draft) || (!isEmpty(quiz.draft) && quiz.draft !== true)) {
                return true;
            }
            else return false;
        } catch (err) {
            console.log("err: ", err);
        }
    });

    // First filter out all quizzes which are hidden
    searchResults = searchResults.filter(quiz => {
        try {
            // console.log(`Name: ${quiz.name}. Is hidden: ${quiz.isHidden}\n`)
            if (isEmpty(quiz.isHidden) || (!isEmpty(quiz.isHidden) && quiz.isHidden !== true)) {
                return true;
            }
            else return false;
        } catch (err) {
            console.log("err: ", err);
        }
    });

    searchResults = searchResults.filter(quiz => {
        
        if (isEmpty(quiz.quizCreatorId)) {
            console.log(`error on quiz ${quiz.name}`);
            return false;
        };
        
        if (!isEmpty(users.filter(user => {
            return user._id.toString() === quiz.quizCreatorId.toString() &&
                (!isEmpty(user.quizzesHidden) && (user.quizzesHidden == true || user.quizzesHidden == "true"))
        }))) {
            return false;
        } else return true;
    })


    // If by the end of the function the boolean variable "atLeastOneFilter" remains false, an empty list will be returned.
    // It switches to true once at least one filter has been entered by the user.
    // This is to prevent, at least for now, the server from returning all known quizzes at once, unfiltered.


    // Filter by quiz ID
    if (!isEmpty(searchableId)) {
        searchResults = searchResults.filter(quiz => {
            return quiz.searchableId === searchableId
        })

        if (isEmpty(searchResults)) {
            // console.log("searchResults: ", searchResults);
            console.log("id error")
            return ["idError"];
        }

        if (!isEmpty(searchResults)) {
            return searchResults;
        }
    }
    // If no quiz ID has been entered, filter out all private quizzes
    else if (isEmpty(searchableId)) {
        searchResults = searchResults.filter(quiz => {
            try {
                if (isEmpty(quiz.isPrivate) || (!isEmpty(quiz.isPrivate) && quiz.isPrivate !== true)) {
                    return true;
                }
                else return false;
            } catch (err) {
                console.log("err: ", err);
            }
        });
    }

    var atLeastOneFilter = false;

    // Filter for each criteria

    // courseId
    if (!isEmpty(courseId)) {
        searchResults = searchResults.filter(quiz => {
            if (!isEmpty(quiz.course) && !isEmpty(quiz.course.id)) {
                return quiz.course.id.toString() === courseId.toString();
            }
            return false;
        })
        atLeastOneFilter = true;
    }


    // majorId
    if (!isEmpty(majorId)) {
        searchResults = searchResults.filter(quiz => {
            if (!isEmpty(quiz.major) && !isEmpty(quiz.major.id)) {
                return quiz.major.id.toString() === majorId.toString();
            }
            return false;
        });
        atLeastOneFilter = true;
    }

    // schoolId
    if (!isEmpty(schoolId)) {
        searchResults = searchResults.filter(quiz => {
            if (!isEmpty(quiz.school) && !isEmpty(quiz.school.id)) {
                return quiz.school.id.toString() === schoolId.toString();
            }
            return false;
        });
        atLeastOneFilter = true;
    }

    // Term

    if (!isEmpty(quizTerm)) {
        // Term season
        if (!isEmpty(quizTerm.season)) {
            searchResults = searchResults.filter(quiz => quiz.term.season === quizTerm.season);
            atLeastOneFilter = true;
        }
        // Term year
        if (!isEmpty(quizTerm.year)) {
            searchResults = searchResults.filter(quiz => quiz.term.year === quizTerm.year);
            atLeastOneFilter = true;
        }
    }

    // Quiz Creator Id
    if (!isEmpty(quizCreatorName)) {
        searchResults = searchResults.filter(quiz => quiz.quizCreator.toString() === quizCreatorName);
        atLeastOneFilter = true;
    }

    if (!atLeastOneFilter) {
        searchResults = [];
    }

    // searchResults = searchResults.filter(quiz => {
    //     return (
    //         !isEmpty(courseId) ? quiz.course.toString() === courseId.toString() : false &&
    //         !isEmpty(majorId) ? quiz.major.toString() === majorId.toString() : false &&
    //         !isEmpty(schoolId) ? quiz.school.toString() === schoolId.toString() : false 
    //         // && !isEmpty(quizTerm.year) ? quiz.term.year === quizTerm.year : null 
    //         // && !isEmpty(quizTerm.season) ? quiz.term.season === quizTerm.season : null
    //         )
    //     })



    return searchResults;
}
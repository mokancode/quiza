const metaphone = require('metaphone');

module.exports = function searchCourses(courses, courseTitle, courseCode, schoolName) {

    // Search by any of the entered parameters, where neither is required.
    var courseTitleRegex, schoolNameRegex;
    if (courseTitle === undefined) { courseTitle = null; } else courseTitleRegex = new RegExp(courseTitle, "ig");
    if (courseCode === undefined) courseCode = null;
    if (schoolName === undefined) { schoolName = null; } else schoolNameRegex = new RegExp(schoolName, "ig");

    var searchResults = [];

    // console.log("cName: ", courseTitle);

    for (var i = 0; i < courses.length; i++) {
        if (courseTitle && courseCode && schoolName
            && courses[i].title.match(courseTitle)
            && courses[i].code.letters.includes(courseCode.letters)
            && courses[i].code.digits.includes(courseCode.digits)
            && courses[i].school.includes(schoolName)) {

            // Exact REGEX match
            console.log("Matches regex")
            searchResults.push(courses[i]);
        }
        else if (metaphone(courses[i].title) === metaphone(courseTitle)
            && metaphone(courses[i].school) === metaphone(schoolName)) {

            // Metaphone match
            console.log("Matches metaphone");
            searchResults.push(courses[i]);
        }
        // else {
        //      // Alternate name search
        //      for (var j = 0; j < majors[i].alternatenames.length; j++) {
        //         if (majors[i].alternatenames[j].match(re)) {
        //             searchResults.push(majors[i]);
        //             break;
        //         }

        //         else if (metaphone(majors[i].alternatenames[j]).includes(metaphone(majorName))) {
        //             searchResults.push(majors[i]);
        //             break;
        //         }
        //     }
        // }
        // else {
        //     /*
        //         wordOne is chosen to be the one that has less characters.
        //         We check if characters of wordOne are included in wordTwo
        //     */

        //     var currentCourseTitle = courses[i].title;
        //     // // Remove the word "Studies" from the course name (only for this search), if it exists.
        //     // currentCourseTitle = currentCourseTitle.replace(/Studies/i, "");
        //     // courseTitle = courseTitle.replace(/Studies/i, "");
        //     // // Remove the word "Science" from the course name (only for this search), if it exists.
        //     // currentCourseTitle = currentCourseTitle.replace(/Science/i, "");
        //     // courseTitle = courseTitle.replace(/Science/i, "");
        //     var wordOne, wordTwo;
        //     if (courseTitle.length > currentCourseTitle) {
        //         wordOne = currentCourseTitle;
        //         wordTwo = courseTitle;
        //     } else {
        //         wordOne = courseTitle;
        //         wordTwo = currentCourseTitle;
        //     }


        //     // Search by characers / letters
        //     var courseTitleSplit = wordOne.split("");
        //     var countOne = 0;

        //     for (var k = 0; k < wordOne.length; k++) {
        //         if (courseTitleSplit[k] === ' ') continue;
        //         if (wordTwo.includes(courseTitleSplit[k])) {
        //             // if (wordTwo.includes(courseTitleSplit[k])) {
        //             // console.log("letter '" + courseTitleSplit[k] + "' is in '" + currentCourseTitle + "'");
        //             countOne++;
        //         }
        //     }

        //     // console.log("wordOne: ", wordOne);
        //     // console.log("wordTwo: ", wordTwo);

        //     // console.log("\ncount: " + countOne + " / " + wordOne.length + "\n")
        //     var charPercentageOne = countOne / wordTwo.length;

        //     // Do the same thing for teacherName
        //     currentTeacherName = courses[i].teachername;
        //     if (teacherName.length > currentTeacherName) {
        //         wordOne = currentTeacherName;
        //         wordTwo = teacherName;
        //     } else {
        //         wordOne = teacherName;
        //         wordTwo = currentTeacherName;
        //     }


        //     // Search by characers / letters
        //     var courseTitleSplit = wordOne.split("");
        //     var countTwo = 0;

        //     for (var k = 0; k < wordOne.length; k++) {
        //         if (courseTitleSplit[k] === ' ') continue;
        //         if (wordTwo.includes(courseTitleSplit[k])) {
        //             countTwo++;
        //         }
        //     }

        //     var charPercentageTwo = countTwo / wordTwo.length;

        //     var charPercentage = (charPercentageOne + charPercentageTwo) / 2.00;
        //     // console.log("charPercentage: ", charPercentage);
        //     if (charPercentage >= 0.7) {
        //         console.log("Matches by characters countOne")
        //         searchResults.push(courses[i]);
        //     }
        //     else {
        //         // No match
        //     }

        // }
    }

    return searchResults;
}
const metaphone = require('metaphone');

module.exports = function searchMajors(majors, majorName) {
    try {
        var searchResults = [];

        var re = new RegExp(majorName, "ig");
        var regexMetaphone = new RegExp(metaphone(majorName), "ig");
        for (var i = 0; i < majors.length; i++) {
            // console.log(majors[i].name);
            if (majors[i].name.match(re)) {
                // Exact REGEX match
                // The if statement asks "Does majors[i].name contain the string inside the re variable?"
                // console.log("Matches regex")
                searchResults.push(majors[i]);
            }
            else if (metaphone(majors[i].name) === metaphone(majorName)) {
                // Metaphone match
                // console.log("Matches metaphone")
                searchResults.push(majors[i]);
            } else {
                // Alternate name search
                for (var j = 0; j < majors[i].alternatenames.length; j++) {
                    if (majors[i].alternatenames[j].match(re)) {
                        searchResults.push(majors[i]);
                        break;
                    }
                    
                    else if (metaphone(majors[i].alternatenames[j]).includes(metaphone(majorName))) {
                        searchResults.push(majors[i]);
                        break;
                    }
                }
            }

            // else {
            //     /* 
            //         wordOne is chosen to be the one that has less characters.
            //         We check if characters of wordOne are included in wordTwo
            //     */
            //     var currentMajorName = majors[i].name;
            //     // Remove the word "Studies" from the major name (only for this search), if it exists.
            //     currentMajorName = currentMajorName.replace(/Studies/i, "");
            //     majorName = majorName.replace(/Studies/i, "");
            //     // Remove the word "Science" from the major name (only for this search), if it exists.
            //     currentMajorName = currentMajorName.replace(/Science/i, "");
            //     majorName = majorName.replace(/Science/i, "");
            //     var wordOne, wordTwo;
            //     if (majorName.length > currentMajorName) {
            //         wordOne = currentMajorName;
            //         wordTwo = majorName;
            //     } else {
            //         wordOne = majorName;
            //         wordTwo = currentMajorName;
            //     }


            //     // Search by characers / letters
            //     var majorNameSplit = wordOne.split("");
            //     var count = 0;

            //     for (var k = 0; k < wordOne.length; k++) {
            //         if (majorNameSplit[k] === ' ') continue;
            //         if (wordTwo.includes(majorNameSplit[k])) {
            //             // if (wordTwo.includes(majorNameSplit[k])) {
            //             console.log("letter '" + majorNameSplit[k] + "' is in '" + currentMajorName + "'");
            //             count++;
            //         }
            //     }

            //     console.log("wordOne: ", wordOne);
            //     console.log("wordTwo: ", wordTwo);

            //     // console.log("\ncount: " + count + " / " + wordOne.length + "\n")
            //     var charPercentage = count / wordTwo.length;
            //     console.log("charPercentage: ", charPercentage);
            //     if (charPercentage >= 0.7) {
            //         console.log("Matches by characters count")
            //         searchResults.push(majors[i]);
            //     }
            //     else {
            //         // No match
            //     }

            // }
        }

        // console.log("searchResults: ", searchResults);
        return searchResults;
    }
    catch (err) {
        console.log("SearchMajors err: ", err);
    }
}
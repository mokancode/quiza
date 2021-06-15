const metaphone = require('metaphone');

module.exports = function searchSchools(schools, schoolName) {

    var searchResults = [];
    // var { city, country } = schoolAddress;

    var exactRegex = new RegExp(schoolName, "ig");
    var metaphoneRegex = new RegExp(metaphone(schoolName), "ig");
    for (var i = 0; i < schools.length; i++) {
        var newSchoolEntry = schools[i].toJSON(); // .toObject() works equally well
        newSchoolEntry.count = 0;
        // var cityRegex = new RegExp(city, "ig");
        // var countryRegex = new RegExp(country, "ig");

        if (schools[i].name.match(exactRegex)) {
            // Exact REGEX match
            // console.log("Matches regex")

            // if (schools[i].address.city.match(cityRegex) && schools[i].address.country.match(countryRegex)) {
            // }

            searchResults.push(newSchoolEntry);
            // searchResults.push(schools[i]);
        }
        else if (metaphone(schools[i].name).match(metaphoneRegex)) {
            // Metaphone match
            // console.log("Matches metaphone")

            // if (schools[i].address.city.match(cityRegex) && schools[i].address.country.match(countryRegex)) {
            // }

            searchResults.push(newSchoolEntry);
            // searchResults.push(schools[i]);
        }

        else {
            // Search by inclusion of keywords
            const schoolNameSplit = schoolName.split(/\s+/);

            var count = 0;

            for (var k = 0; k < schoolNameSplit.length; k++) {
                if (schools[i].name.includes(schoolNameSplit[k])) {
                    count++;
                } else if (metaphone(schools[i].name).includes(metaphone(schoolNameSplit[k]))) {
                    count++;
                }
            }

            console.log("count: ", count);
            console.log("schoolNameSplit.length: ", schoolNameSplit.length);

            if ((count / schoolNameSplit.length) >= 0.5) {
                newSchoolEntry.count = count;
                searchResults.push(newSchoolEntry);
                console.log("match by inclusion of keywords")
            }
        }
    }

    return searchResults;
}
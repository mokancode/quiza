const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
// const validateContactInput = require('../../validation/contact');

// Load course search function
const searchCourses = require("../../utils/SearchCourses");
const searchMajors = require("../../utils/SearchMajors");

// Load models
const School = require("../../models/School");
const Course = require("../../models/Course");
const Major = require("../../models/Major");

// @route GET api/users/getcourses:id
// @desc Fetches a list of all courses
// @access Public
router.get("/getcourse/:id", (req, res) => {
  Course.findById(req.params.id)
    .then((course) => {
      if (course) return res.json(course);
      else return res.status(404).json(null);
    })
    .catch((err) => res.status(500).json(null));
});

// @route GET api/users/getcourses
// @desc Fetches a list of all courses
// @access Public
router.get("/getcourses/:letters", (req, res) => {
  var courseCodeLetters = req.params.letters;
  Course.find()
    .select("-__v -date")
    .then((courses) => {
      try {
        var coursesToReturn = courses.filter((elt) => {
          var regex = new RegExp(courseCodeLetters, "ig");
          return elt.code.letters[0].match(regex);
        });

        coursesToReturn = coursesToReturn.map((elt) => {
          var code = {
            id: elt._id,
            title: elt.title,
            letters: elt.code.letters,
            digits: elt.code.digits,
          };
          return code;
        });
        res.json(coursesToReturn);
      } catch (err) {
        console.log("getcourses:/letters err c: ", err);
      }
    })
    .catch((err) => {
      console.log("getcourses:/letters err: ", err);
      res.status(500).json(err);
    });
});
// @route GET api/users/getcourses
// @desc Fetches a list of all courses
// @access Public
router.get("/getcourses/", (req, res) => {
  Course.find()
    // .select({ '_id': 0, 'name': 1, 'address': 1 })
    // .select("-_id name teachername code")
    .select("-__v -date")
    .then((courses) => {
      return res.json(courses);
    })
    .catch((err) => res.status(500).json(err));
});

// @route POST api/users/getcourses/title
// @desc Fetches a list of all courses by course title
// @access Public
router.post("/getcourses/title", (req, res) => {
  const { courseTitle } = req.body;

  Course.find()
    .then((courses) => {
      try {
        var coursesToReturn = searchCourses(courses, courseTitle);
        if (coursesToReturn.length > 0) {
          return res.json({ "search results": coursesToReturn });
        } else return res.json("No results found");
      } catch (err) {
        console.log("/getcourses/title err: ", err);
      }
    })
    .catch((err) => res.json({ "getcourses/title err": err }));
});

// @route POST api/users/getcourse
// @desc Fetches course by input parameters (name and/or address)
// @access Public
router.post("/getcourse/", (req, res) => {
  var error = {};

  var { courseTitle } = req.body;
  if (!courseTitle) {
    courseTitle = "";
  }

  Course
    .find
    // {$or: [
    //     { name: courseTitle }, { 'address.country': /`${courseAddress.country}`/i }, { 'address.city': courseAddress.city }
    // ]}
    ()
    .select("-_id title")
    .then((courses) => {
      if (courses) {
        try {
          var searchResults = searchCourses(courses, courseTitle);
          if (searchResults.length > 0) {
            return res.json(searchResults);
          } else {
            error.courses = "No courses found with such keywords";
            return res.status(404).json(error);
          }
        } catch (err) {
          console.log("error: ", err);
        }
      } else {
        return res.status(404).json("No course(s) found with entered parameters");
      }
    })
    .catch((err) => res.json(err));
});

// @route POST api/courses/addcourse
// @desc Add a course
// @access Private
router.post("/addcourse/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var error = {};

  const { courseTitle, courseCode, courseMajor, schoolName, schoolId } = req.body;

  if (schoolId) {
    if (schoolId.length > 0) {
    }
  }

  Course.find()
    .select("-_id title teachername code major")
    .then((courses) => {
      School.find()
        .then((schools) => {
          Major.find()
            .select("_id name alternatenames")
            .then((majors) => {
              try {
                var schoolNameRegex = new RegExp(schoolName, "ig");
                var schoolId = schools.find((elt) => elt.name.match(schoolNameRegex));
                if (schoolId !== undefined) {
                  schoolId = schoolId._id;
                } else {
                  var schoolSearch = searchSchools(schools, courseMajor);
                  // return res.json(schoolSearch);
                  if (schoolSearch.length > 0) {
                    error.msg = "Did you mean these schools?";
                    error.schools = schoolSearch;
                    return res.status(400).json(error);
                  } else {
                    error.addcourse = "That school is not in the database";
                    return res.status(404).json({ error });
                  }
                }

                var majorId = majors.find((elt) => elt.name === courseMajor);
                if (majorId !== undefined) {
                  majorId = majorId._id;
                } else {
                  var majorSearch = searchMajors(majors, courseMajor);
                  // return res.json(majorSearch);
                  if (majorSearch.length > 0) {
                    error.msg = "Did you mean these majors?";
                    error.majors = majorSearch;
                    return res.status(400).json(error);
                  } else {
                    error.addcourse = "That major is not in the database";
                    return res.status(404).json({ error });
                  }
                }

                var searchResults = searchCourses(courses, courseTitle, courseCode);
                if (searchResults.length > 0) {
                  error.msg = "It seems like such a course already exists. Did you mean any of these?";
                  error.searchResults = searchResults;
                  return res.json(error);
                } else {
                  const newCourse = new Course({
                    title: courseTitle,
                    code: courseCode,
                    major: majorId,
                    school: schoolId,
                  });

                  return newCourse
                    .save()
                    .then((course) => {
                      return res.json(course);
                    })
                    .catch((err) => {
                      error.course = "Error creating course";
                      error.err = err;
                      return res.status(500).json(error);
                    });

                  // return res.json("Add course now");
                  // error.courses = "No courses found with such keywords";
                  // return res.status(404).json(error);
                }
              } catch (err) {
                console.log("error: ", err);
              }
            }) // majors
            .catch((err) => {
              error.addcourse = "Error finding majors";
              error.err = err;
              return res.status(404).json(error);
            });
        }) // schools
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));

  // const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  // if (!isValid) {
  //     return res.status(400).json(errors);
  // }

  // Contact.findOne({ email: req.body.email })
  //     .then(user => {
  //         if (user) {
  //             errors.email = "That email is taken";
  //             return res.status(400).json(errors);
  //         } else {
  //             User.findOne({ username: req.body.username })
  //                 .then(user => {
  //                     if (user) {
  //                         errors.username = 'That username is taken';
  //                         return res.status(400).json(errors);
  //                     } else {
  //                         const newUser = new User({
  //                             username: req.body.username,
  //                             email: req.body.email,
  //                             password: req.body.password,
  //                         });

  //                         bcrypt.genSalt(10, (err, salt) => {
  //                             bcrypt.hash(newUser.password, salt, (err, hash) => {
  //                                 if (err) throw err;
  //                                 newUser.password = hash;
  //                                 newUser
  //                                     .save()
  //                                     .then(user => res.json({ user }))
  //                                     .catch(err => console.log("registration/bcrypt err: ", err));
  //                             }) // hash
  //                         }) // bcrypt genSalt
  //                     } // else user not found,
  //                 }) // then create user
  //         } // else email not found
  //     })
}); // post register

module.exports = router;

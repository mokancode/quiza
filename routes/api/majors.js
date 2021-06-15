const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load major search function
const searchMajors = require("../../utils/SearchMajors");

// Load Major model
const Major = require("../../models/Major");

// @route GET api/users/getmajors
// @desc Fetches a list of all majors
// @access Public
router.get("/getmajors/", (req, res) => {
  Major.find()
    // .select({ '_id': 0, 'name': 1, 'address': 1 })
    // .select("-_id name alternatenames")
    .select("_id name")
    .then((majors) => {
      if (majors) {
        let fieldsOfStudyList = majors;
        fieldsOfStudyList.sort(function (a, b) {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
        return res.json(majors);
      }
    })
    .catch((err) => res.status(500).json(err));
});

// @route POST api/users/getmajor
// @desc Fetches major by input parameters (name and/or address)
// @access Public
router.post("/addmajoralternatenames/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { majorName, alternateNames } = req.body;
  Major.findOne({ name: majorName })
    .then((major) => {
      try {
        if (major) {
          var currentAlternateNames = major.alternatenames;

          for (var i = 0; i < alternateNames.length; i++) {
            if (!currentAlternateNames.includes(alternateNames[i])) {
              currentAlternateNames.push(alternateNames[i]);
            }
          }
          major.alternatenames = currentAlternateNames;
          major
            .save()
            .then((major) => {
              return res.json(major);
            })
            .catch((err) => res.json(err));
        } else {
          return res.status(404).json("Major not found");
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => res.json(err));
});

// @route POST api/users/getmajor
// @desc Fetches major by ID
// @access Public
router.get("/getmajor/:id", (req, res) => {
  Major.findById(req.params.id)
    .then((major) => {
      if (major) return res.json(major);
      else return res.status(404).json(null);
    })
    .catch((err) => res.status(500).json(null));
});

// @route POST api/users/getmajor
// @desc Fetches major by input parameters (name and/or address)
// @access Public
router.post("/getmajor/", (req, res) => {
  var error = {};

  var { majorName } = req.body;
  if (!majorName) {
    majorName = "";
  }

  Major
    .find
    // {$or: [
    //     { name: majorName }, { 'address.country': /`${majorAddress.country}`/i }, { 'address.city': majorAddress.city }
    // ]}
    ()
    // .select("-_id name")
    .then((majors) => {
      if (majors) {
        try {
          var findMajor = majors.find((elt) => elt.name === majorName);
          if (findMajor !== undefined) {
            return res.json(findMajor);
          } else {
            var searchResults = searchMajors(majors, majorName);
            if (searchResults.length > 0) {
              return res.json(searchResults);
            } else {
              error.majors = "No majors found with such keywords";
              return res.status(404).json(error);
            }
          }
        } catch (err) {
          console.log("error: ", err);
        }
      } else {
        return res.status(404).json("No major(s) found with entered parameters");
      }
    })
    .catch((err) => res.json(err));
});

// @route POST api/majors/addmajor
// @desc Add a major
// @access Private
router.post("/addmajor/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var error = {};

  const { majorName } = req.body;

  Major.find()
    .select("-_id name alternatenames")
    .then((majors) => {
      if (majors) {
        try {
          var searchResults = searchMajors(majors, majorName);
          if (searchResults.length > 0) {
            error.msg = "It seems like such a major already exists. Did you mean any of these?";
            error.searchResults = searchResults;
            return res.json(error);
          } else {
            const newMajor = new Major({
              name: majorName,
            });

            return newMajor
              .save()
              .then((major) => {
                return res.json(major);
              })
              .catch((err) => {
                error.major = "Error creating major";
                return res.status(500).json(error);
              });

            // return res.json("Add major now");
            // error.majors = "No majors found with such keywords";
            // return res.status(404).json(error);
          }
        } catch (err) {
          console.log("error: ", err);
        }
      } else {
        return res.status(404).json("No major(s) found with entered parameters");
      }
      n;
    })
    .catch((err) => res.json(err));
}); // post register

module.exports = router;

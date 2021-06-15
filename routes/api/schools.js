const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const mongoose = require('mongoose');

const path = require('path');
const multer = require('multer');

// Set Storage Engine for Multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("req user : ", req.user);
        return;
        // console.log("ext name: ", path.extname(file.originalname));
        cb(null, path.basename(file.originalname) + "__time_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage
}).single('myImage');

// Load input validation
// const validateContactInput = require('../../validation/contact');

// Load school search function
const searchSchools = require('../../utils/SearchSchools');

// Load School model
const School = require('../../models/School');

// @route GET api/users/getschools
// @desc Fetches a list of all schools
// @access Public
router.get('/getschools/:initial', (req, res) => {
    var schoolInitial = req.params.initial;
    School.find()
        .select("-__v -date")
        .then(schools => {
            try {
                var schoolsToReturn = schools.filter(elt => {
                    var regex = new RegExp(schoolInitial, "ig");
                    return elt.name[0].match(regex);
                })

                schoolsToReturn = schoolsToReturn.map(elt => {
                    var school = {
                        id: elt._id,
                        name: elt.name
                    }
                    return school;
                });
                res.json(schoolsToReturn)
            }
            catch (err) {
                console.log("getschools:/letters err c: ", err);
            }
        })
        .catch(err => {
            console.log("getschools:/letters err: ", err);
            res.status(500).json(err)
        });
});

// @route GET api/users/getschools
// @desc Fetches a list of all schools
// @access Public
router.post('/getschoolsbyinput/', (req, res) => {

    const { schoolName } = req.body;

    // console.log("schoolName: ", schoolName);

    School.find()
        .select("_id name address")
        .then(schools => {
            try {

                // Find by exact string match
                var foundName = schools.find(elt => elt.name === schoolName)

                if (foundName) {
                    foundName = foundName.toJSON(); // .toObject() works equally well
                    return res.json({ "exact match": foundName });
                } else {
                    var relevantSchools = searchSchools(schools, schoolName);


                    return res.json({ "relevantSchools": relevantSchools });
                }
            }
            catch (err) {
                console.log("getschoolsbyinput: ", err);
            }
        })
        .catch(err => res.status(500).json(err));
});

// @route GET api/users/getschools
// @desc Fetches a list of all schools
// @access Public
router.get('/getschools/', (req, res) => {
    School.find()
        // .select({ '_id': 0, 'name': 1, 'address': 1 })
        .select("-_id name address")
        .then(schools => {
            res.json(schools)
        })
        .catch(err => res.status(500).json(err));
});


// @route POST api/schools/getschools
// @desc Fetches school by ID
// @access Public
router.get('/getmajor/:id', (req, res) => {
    School.findById(req.params.id).then(school => {
        if (school) return res.json(school);
        else return res.status(404).json(null);
    }).catch(err => res.status(500).json(null));
});
    

// @route POST api/users/getschool
// @desc Fetches school by input parameters (name and/or address)
// @access Public
router.post('/getschool/', (req, res) => {

    var error = {}

    var { schoolName, schoolAddress } = req.body;
    if (!schoolName) {
        schoolName = "";
    }
    if (!schoolAddress) {
        schoolAddress = {};
    }
    if (!schoolAddress.country) {
        schoolAddress.country = '';
    }
    if (!schoolAddress.city) {
        schoolAddress.city = '';
    }

    School.find(
        // {$or: [
        //     { name: schoolName }, { 'address.country': /`${schoolAddress.country}`/i }, { 'address.city': schoolAddress.city }
        // ]}
    )
        .select("-_id name address")
        .then(schools => {
            if (schools) {
                try {
                    var searchResults = searchSchools(schools, schoolName, schoolAddress);
                    if (searchResults.length > 0) {
                        return res.json(searchResults);
                    } else {
                        error.schools = "No schools found with such keywords";
                        return res.status(404).json(error);
                    }
                }
                catch (err) {
                    console.log("error: ", err);
                }
            }
            else {
                return res.status(404).json("No school(s) found with entered parameters")
            }
        })
        .catch(err => res.json(err));
});


// @route POST api/schools/addschool
// @desc Add a school
// @access Private
router.post('/addschool/', passport.authenticate('jwt', { session: false }), (req, res) => {


    var error = {};

    const { schoolName, schoolAddress } = req.body;

    School.find()
        .then(schools => {
            try {
                var schoolList = searchSchools(schools, schoolName, schoolAddress);
                if (schoolList.length > 0) {
                    error.addschool = "That school might already exist in the DB. Consider the following:";
                    err.schools = schoolList;
                    return res.status(400).json(err);
                }
                else {

                    const newSchool = new School({
                        name: schoolName,
                        address: schoolAddress
                    });

                    newSchool.save()
                        .then(school => res.json(school))
                        .catch(err => {
                            error.school = "Error creating school";
                            return res.status(500).json(error);
                        })
                }
            }
            catch (err) {
                console.log("addschool ERROR: ", err);
            }
        })
        .catch(err => {
            error.school = "Error finding school";
            return res.status(500).json(error);
        })


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
}) // post register

module.exports = router;
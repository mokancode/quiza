// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
// const passport = require("passport");

// // Load input validation
// // const validateContactInput = require('../../validation/contact');

// // Load User model
// // const User = require('../../models/User');

// // Load Profile model
// // const Profile = require('../../models/Profile');

// // Load Contact model
// const Contact = require("../../models/Contact");

// // @route GET api/users/getcontact
// // @desc Fetches current user's contact
// // @access Private
// router.get("/getcontact/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
//   var friendId = req.params.id;
//   var error = {};

//   Contact.findOne({
//     $or: [
//       { $and: [{ personone: req.user._id }, { persontwo: friendId }] },
//       { $and: [{ personone: friendId }, { persontwon: req.user._id }] },
//     ],
//   })
//     .then((contact) => {
//       if (contact) {
//         return res.json(contact);
//       } else {
//         error.contact = "Contact not found";
//         return res.status(404).json(error);
//       }
//     })
//     .catch((err) => {
//       error.contact = "Error fetching contact";
//       res.status(500).json(error);
//     });
// });

// // @route GET api/users/getmycontacts
// // @desc Fetches current user's contacts
// // @access Private
// router.post("/createcontact/", passport.authenticate("jwt", { session: false }), (req, res) => {
//   const { persontwoId } = req.body;

//   const newContact = {
//     personone: req.user._id,
//     persontwo: persontwoId,
//   };

// //   console.log("newContact: ", newContact);

//   // const { errors, isValid } = validateRegisterInput(req.body);

//   // Check validation
//   // if (!isValid) {
//   //     return res.status(400).json(errors);
//   // }

//   // Contact.findOne({ email: req.body.email })
//   //     .then(user => {
//   //         if (user) {
//   //             errors.email = "That email is taken";
//   //             return res.status(400).json(errors);
//   //         } else {
//   //             User.findOne({ username: req.body.username })
//   //                 .then(user => {
//   //                     if (user) {
//   //                         errors.username = 'That username is taken';
//   //                         return res.status(400).json(errors);
//   //                     } else {
//   //                         const newUser = new User({
//   //                             username: req.body.username,
//   //                             email: req.body.email,
//   //                             password: req.body.password,
//   //                         });

//   //                         bcrypt.genSalt(10, (err, salt) => {
//   //                             bcrypt.hash(newUser.password, salt, (err, hash) => {
//   //                                 if (err) throw err;
//   //                                 newUser.password = hash;
//   //                                 newUser
//   //                                     .save()
//   //                                     .then(user => res.json({ user }))
//   //                                     .catch(err => console.log("registration/bcrypt err: ", err));
//   //                             }) // hash
//   //                         }) // bcrypt genSalt
//   //                     } // else user not found,
//   //                 }) // then create user
//   //         } // else email not found
//   //     })
// }); // post register

// module.exports = router;

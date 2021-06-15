const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');

// Load Profile model
const Profile = require('../../models/Profile');

// Load User model
const User = require('../../models/User');

// @route GET api/profiles
// @desc Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .populate('user', ['name'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status((404).json(err)));
})

// @route POST api/profiles
// @desc Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    profile.name = req.body.name;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // Update

                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                ).then(profile => res.json(profile));
            } else {
                // Create
                Profile.findOne({ user: req.user.id })
                    .then(profile => {
                        if (profile) {
                            errors.user = "A profile already exists for this user"
                            res.status(400).json(errors);
                        } else {
                            // Save profile
                            new Profile(profileFields)
                                .save()
                                .then(profile => {
                                    res.json(profile);
                                })
                        }
                    })
            } // else create
        })
}) // create profile

// @route GET api/profiles/user/:id
// @desc Get profile by user id
// @acccess Private
router.get('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({user: req.params.id})
    .populate('users', ['name'])
    .then(profile => {
        if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
        } else {
            return res.json(profile);
        }
    })
    .catch(err => res.status(404).json({ profile: "There is no profile for this user" }));
})

module.exports = router;
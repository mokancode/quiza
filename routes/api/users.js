const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const ObjectId = require("mongoose").Types.ObjectId;

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateResetPasswordInput = require("../../validation/password-reset");
const validateRequestResetPasswordInput = require("../../validation/request-password-reset");
const isEmpty = require("../../validation/is-empty");

// Load User model
const User = require("../../models/User");
// Load Profile model
const Profile = require("../../models/Profile");
const sendMail = require("../../services/MailjetMailer");

// @route POST api/users/register
// @desc Register a user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, displayName, email, password } = req.body;

  // return res.json("register");

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email is already taken";
      return res.status(400).json(errors);
    } else {
      User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
          errors.username = "Username is already taken";
          return res.status(400).json(errors);
        } else {
          const newUser = new User({
            username,
            displayName,
            email,
            password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                errors.registration = "Registration failed";
                return res.status(500).json(errors);
                // throw err;
              }
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  // Create JWT payload
                  const payload = {
                    id: user.id,
                  };

                  // console.log("payload: ", payload);

                  // Sign the token
                  return jwt.sign(
                    payload,
                    keys.secretOrKey,
                    // { expiresIn: "1d" },
                    (err, token) => {
                      errors.registration = "Registration failed";
                      if (!isEmpty(err)) return res.status(500).json(errors);

                      // return res.json({ token });

                      try {
                        // Send activation email
                        var templateParams = {
                          recipient_email: email,
                          recipient_name: displayName,
                          app_name: "Quiza",
                          activationURL: `https://quiza-mokancode.herokuapp.com/confirm/${token}`,
                          templateID: 2327461,
                          subject: `Activate your Quiza account`,

                          // activationURL: `http://localhost:3000/confirm/${token}`
                        };

                        var mPromise = function (templateParams) {
                          sendMail(templateParams)
                            .then(
                              function (fulfilled) {
                                console.log("mail sent:", fulfilled);
                                return res.json("User created and activation mail sent");
                              }.bind(this)
                            )
                            .catch(
                              function (error) {
                                console.log("error: ", error);
                                errors.registration =
                                  "User created but an account verification email could not be sent due to server error." +
                                  " Try requesting it again later";
                                return res.status(400).json(errors);
                              }.bind(this)
                            );
                        }.bind(this);
                        mPromise(templateParams);
                      } catch (err) {
                        console.log("registration sendmail error: ", err);
                      }
                      // return res.json(token);
                    }
                  );
                })
                .catch((err) => {
                  errors.registration = "Registration failed";
                  return res.status(500).json(errors);
                  // console.log("registration/bcrypt err: ", err);
                });
            }); // hash
          }); // bcrypt genSalt
        } // else user not found,
      }); // then create user
    } // else email not found
  });
}); // post register

// @route POST api/users/login
// @desc Login User / Return JWT Token
// @access Public
router.post("/login", (req, res) => {
  console.log("login");

  // console.log("req body: ", req.body);

  // const { username, password } = req.body;
  // User.findOne({ username })
  //     .then(user => {
  //         console.log("uSerIno: ", user);
  //     })
  //     .catch(err => console.log("ERRRRRORRRRR: ", err));

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (user) {
      Profile.findOne({ user: user._id }).then((profile) => {
        // Check for user
        if (!user) {
          // errors.username = "User not found";
          errors.login = "Incorrect login";
          return res.status(404).json(errors);
        }

        if (user.verified !== true) {
          errors.login = "Account not yet activated";
          return res.status(404).json(errors);
        }

        // Check for password
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            // User matched

            // Create JWT payload
            const payload = {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              verified: user.verified,
            };

            // console.log("payload: ", payload);

            // Sign the token
            jwt.sign(
              payload,
              keys.secretOrKey,
              // { expiresIn: "1d" },
              (err, token) => {
                res.json({
                  success: true,
                  token: `Bearer ${token}`,
                });
              }
            );
          } // if isMatch
          else {
            // errors.password = "Password incorrect";
            errors.login = "Incorrect login";
            return res.status(400).json(errors);
          } // else not isMatch
        }); // then isMatch
      }); // then profile
    } // if user exists
    else {
      // errors.username = "User not found";
      errors.login = "Incorrect login";
      return res.status(404).json(errors);
    }
  }); // then user
}); // login route

// @route POST api/users/changedisplayname
// @desc Change display name
// @access Private
router.post("/changedisplayname", (req, res) => {
  var errors = {};
  passport.authenticate("jwt", (err, reqUser, info) => {
    if (err) {
      errors.user = err;
      return res.status(401).json(errors);
    }

    var { newDisplayName } = req.body;

    try {
      User.findById(reqUser.id)
        .then((user) => {
          Quiz.find()
            .then((quizzes) => {
              var oldDisplayName = user.displayName;
              user.displayName = newDisplayName;

              user
                .save()
                .then((savedUser) => {
                  try {
                    var requests = [];
                    quizzes.forEach((quiz) => {
                      var newQuiz = Object.assign({}, quiz);

                      // console.log("newQuiz: ", newQuiz);
                      // console.log("newQuiz: ", newQuiz);

                      newQuiz.quizCreator = newDisplayName;
                      delete newQuiz._id;

                      requests.push({
                        // 'replaceOne': {
                        //     'filter': { "quizCreatorId": reqUser.id },
                        //     'replacement': { newQuiz }
                        // }

                        "updateOne": {
                          "filter": {
                            quizCreator: oldDisplayName,
                            quizCreatorId: reqUser.id,
                            // quizCreatorId: { $exists: true }
                          },
                          "update": { "$set": { "quizCreator": newDisplayName } },
                        },
                      });
                      if (requests.length === 500) {
                        //Execute per 500 operations and re-init
                        Quiz.bulkWrite(requests);
                        requests = [];
                      }
                    });

                    // return res.json({ requests });
                    // console.log("requests length: ", requests.length);

                    // return res.json({ requests });

                    if (requests.length > 0) {
                      Quiz.bulkWrite(requests).then((updatesCompleted) => {
                        return res.json(updatesCompleted);
                      });
                    }
                  } catch (err) {
                    console.log("ERROR: ", err);
                  }
                })
                .catch((err) => {
                  errors.displayName = "Error updating display name";
                  return res.status(500).json({ errors, err });
                });
            })
            .catch((err) => {
              errors.displayName = "Server error. Could not load quizzes";
              return res.status(500).json({ errors });
            });
        })
        .catch((err) => {
          errors.displayName = "Server error. User not found";
          return res.status(500).json({ errors });
        });
    } catch (err) {
      console.log("ERROR: ", err);
    }
  })(req, res);
});

// @route GET api/confirm
// @desc Confirm verification email
// @access Public
router.get("/confirm/:token", (req, res) => {
  var { token } = req.params;
  var errors = {};
  try {
    const { id } = jwt.verify(token, keys.secretOrKey, function (err, decoded) {
      if (err) {
        errors.verified = "Token has expired";
        return res.status(400).json(errors);
      }
      return decoded;
    });

    return User.findById(id)
      .then((user) => {
        if (!user) {
          console.log("error activating account: user not found");
          errors.verified = "User not found";
          return res.status(400).json(errors);
        }

        if (user.verified === true) {
          console.log("error activating account: account is already activated");
          errors.verified = "Account is already activated";
          return res.status(400).json(errors);
        }

        user.verified = true;
        user
          .save()
          .then((savedUser) => {
            return res.json("Account activated. You may log in now");
            // return res.json(savedUser);
          })
          .catch((err) => {
            console.log("error activating account: unable to activate user");
            errors.verified = "Unable to activate account.";
            return res.status(500).json(errors);
          });
      })
      .catch((err) => {
        return res.json(err);
      });
  } catch (err) {
    console.log("error activating account");
    errors.verified = "Invalid token";
    return res.status(500).json(errors);
  }

  // return res.json(id);

  // return User.updateOne({ verified: false }, { where: { _id: ObjectId(id) } }).then(updated => {
  //     return res.json(updated);
  // }).catch(err => { return res.json(err) });
});

// @route POST api/requestpasswordreset
// @desc Send password reset email
// @access Public
router.post("/requestpasswordreset", (req, res) => {
  var { username, email } = req.body;

  // console.log(username, email);

  const { isValid, errors } = validateRequestResetPasswordInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((user) => {
      if (user) {
        // console.log("user found");

        const currentTime = new Date();

        if (!isEmpty(user.passwordResetRequestExpirationDate)) {
          if (currentTime.getTime() < new Date(user.passwordResetRequestExpirationDate).getTime()) {
            errors.passwordResetRequest = "Must wait a day before requesting another password reset";
            return res.status(500).json({ errors });
          }
        }
        if (!isEmpty(user.passwordResetExpirationDate)) {
          if (currentTime.getTime() < new Date(user.passwordResetExpirationDate).getTime()) {
            errors.passwordResetRequest = "Must wait 10 days between password resets";
            return res.status(500).json({ errors });
          }
        }

        const payload = {
          id: user._id,
          displayName: user.displayName,
        };
        // return res.json(payload);

        return jwt.sign(payload, keys.secretOrKey, { expiresIn: "1d" }, (err, token) => {
          if (!isEmpty(err)) {
            console.log("err: ", err);
            errors.passwordResetRequest = "Server error";
            return res.status(500).json({ errors });
          }

          var templateParams = {
            recipient_email: user.email,
            recipient_name: user.displayName,
            app_name: "Quiza",
            passwordResetURL: `https://quiza-mokancode.herokuapp.com/resetpassword?token=${token}`,
            templateID: 2357927,
            subject: "Reset your Quiza account password",
          };

          var mPromise = function (templateParams) {
            sendMail(templateParams)
              .then((fulfilled) => {
                console.log("mail sent:", fulfilled);

                var passwordResetRequestExpirationDate = currentTime;
                passwordResetRequestExpirationDate.setHours(passwordResetRequestExpirationDate.getHours() + 24); // set time point 24 hours in the future
                user.passwordResetRequestExpirationDate = passwordResetRequestExpirationDate;

                // console.log("passwordResetRequestExpirationDate", passwordResetRequestExpirationDate);

                return user
                  .save()
                  .then((newUser) => {
                    return res.json({ "Password reset request processed": token });
                    // return res.json("Password reset request processed");
                  })
                  .catch((err) => {
                    errors.passwordResetRequest = "Password reset failed (server error)";
                    return res.status(500).json({ errors });
                    // console.log("password reset save user err: ", err);
                  });
              }) // end of sendMail
              .catch(
                function (error) {
                  console.log("password reset mail error: ", error);
                  errors.passwordResetRequest = "Server error";
                  return res.status(400).json({ errors });
                }.bind(this)
              );
          }.bind(this);
          mPromise(templateParams);

          // return res.json(token);
        });
      }

      console.log("user not found");
      errors.passwordResetRequest = "User not found";
      return res.status(404).json({ errors });
    })
    .catch((err) => {
      errors.passwordResetRequest = "Server error";
      return res.status(500).json({ errors });
    });
});
// @route POST api/resetpassword
// @desc Reset password
// @access Public
router.post("/resetpassword", (req, res) => {
  const { token, password, password2 } = req.body;

  console.log("reset pass");

  const { errors, isValid } = validateResetPasswordInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // return res.json(token);

  const id = jwt.verify(token, keys.secretOrKey, function (err, decoded) {
    if (err) {
      errors.resetpassword = "Token has expired";
      return;
    }
    return decoded.id;
  });

  if (!isEmpty(errors)) return res.status(400).json({ errors });

  User.findById(id)
    .then((user) => {
      if (user) {
        // console.log("user found");

        var currentTime = new Date();
        if (!isEmpty(user.passwordResetExpirationDate)) {
          if (currentTime.getTime() < new Date(user.passwordResetExpirationDate).getTime()) {
            errors.resetpassword = "Must wait 10 days between password resets";
            return res.status(500).json({ errors });
          }
        }

        // Check for password
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            // User matched
            errors.resetpassword = "Your new password must be differ from the old";
            return res.status(400).json({ errors });
          } // if isMatch
          else {
            // Encrypt new password
            return bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                  errors.resetpassword = "Password reset failed (server error)";
                  return res.status(500).json({ errors });
                }

                user.password = hash; // Update encrypted password

                var passwordResetExpirationDate = currentTime;
                passwordResetExpirationDate.setHours(passwordResetExpirationDate.getHours() + 24 * 10); // set time point 10 days in the future
                user.passwordResetExpirationDate = passwordResetExpirationDate;

                user
                  .save()
                  .then((newUser) => {
                    return res.json("Password reset");
                  })
                  .catch((err) => {
                    errors.resetpassword = "Password reset failed (server error)";
                    return res.status(500).json({ errors });
                    // console.log("password reset save user err: ", err);
                  });
              }); // end of hash
            }); // end of bcrypt genSalt
          } // else not isMatch
        }); // then isMatch
      } else {
        console.log("user not found");
        errors.resetpassword = "User not found";
        return res.status(500).json({ errors });
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      errors.resetpassword = "Server error";
      return res.status(500).json({ errors });
    });
});

module.exports = router;

// Dev routes:

// @route GET api/users/getuserbyid
// @desc Get user by ID
// @access Dev
// router.get('/getuserbyid/:id', (req, res) => {
//     User.findById(req.params.id)
//         .select('username')
//         .then(user => {
//             if (user) {
//                 return res.json(user)
//             } else {
//                 var error = {};
//                 error.user = "User not found"
//                 return res.status(404).json({ error });
//             }
//         })
//         .catch(err => res.status(500).json({ error: err }));
// });

// @route GET api/users/
// @desc Get all users
// @access Dev
// router.get('/', (req, res) => {
//     User.find()
//         .then(users => {
//             res.json(users)
//         })
// });

// @route GET api/users/current
// @desc Return current user
// @access Dev
// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({
//         msg: 'success',
//         user: req.user
//     });
// });

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const ObjectId = require("mongoose").Types.ObjectId;
const isEmpty = require("../../validation/is-empty");
const metaphone = require("metaphone");
const lodash = require("lodash");
const Validator = require("validator");
const { v4: generateUniqueID } = require("uuid");

const fs = require("fs");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, `${req.user.username}_tm__${Date.now()}__tm_${file.originalname}`);
    // console.log("file original name: ", `${file.originalname}`);
    // console.log("file path: ", `${file.path}`);

    // console.log("file req; ", file);

    cb(null, `${req.user.username}_tm__${Date.now()}__tm_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // console.log("\ntype jpeg", file);

    // accept a file
    cb(null, true);
  } else {
    // cb(null, false);
    // cb(new Error("File type incompatible"));
    cb("File type incompatible");
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500000, // bytes
  },
  fileFilter,
}).single("questionImage");
// const upload = multer({ dest: "uploads/" })

// Load input validation
const validateQuizzesSearchInput = require("../../validation/validateQuizzesSearchInput");
const mTrim = require("../../validation/mTrim");
// const removeDuplicates = require("../../validation/removeDuplicates");
const validateAddQuizComponents = require("../../validation/validateAddQuizComponents");
const validateAddQuizDraftComponents = require("../../validation/validateAddQuizDraftComponents");
const validateReview = require("../../validation/validateReview");

// Load quiz search function
const searchQuizzes = require("../../utils/SearchQuizzes");

// Load models
const Quiz = require("../../models/Quiz");
const Course = require("../../models/Course");
const Major = require("../../models/Major");
const School = require("../../models/School");
const User = require("../../models/User");

// @route GET api/quizzes/Takequiz/:id
// @desc Take quiz by id
// @access Public
router.get("/takequiz/:id", (req, res) => {
  var errors = {};

  // console.log("req user: ", req.user);

  Quiz.findById(req.params.id)
    .select("-__v -date")
    .then((quiz) => {
      if (quiz) {
        if (isEmpty(quiz.quizCreatorId)) {
          errors.quiz =
            "The quiz data is corrupted and has been deleted. You may take this quiz but rating / reviewing it will not register";
          errors.quizDeletedByServerDueToDataCorruption = true;
          return Quiz.findByIdAndDelete(req.params.id)
            .then((success) => {
              var quizTemp = Object.assign({}, quiz._doc);
              quizTemp.errors = errors;
              return res.json(quizTemp);
            })
            .catch((err) => {
              errors.quiz = "The quiz data is corrupted but the server encountered an error while deleting it.";
              return res.status(500).json(errors);
            });
        } else if (quiz.draft === true) {
          // errors.quiz = "The requested quiz is still a draft";
          errors.quiz = [
            { type: "p", text: "The requested quiz is still a" },
            { type: "span", text: "draft" },
          ];
          return res.status(403).json(errors);
        } else if (quiz.isHidden) {
          // errors.quiz = "The requested quiz was set Hidden by its creator";
          errors.quiz = [
            { type: "p", text: "The requested quiz was set " },
            { type: "span", text: "hidden" },
            { type: "p", text: " by its creator" },
          ];
          return res.status(403).json(errors);
        }

        // return res.json(quiz);
        var questionsListWithoutCorrectAnswers = quiz.questionsList.map(function (question, index) {
          var questionWithoutCorrectAnswers = Object.assign({}, question._doc);

          var potentialAnswers = questionWithoutCorrectAnswers.potentialAnswers;
          var potentialAnswersWithoutCorrectAnswers = [];
          for (var i = 0; i < potentialAnswers.length; i++) {
            var potentialAnswer = {};
            potentialAnswer.potentialAnswer = potentialAnswers[i].potentialAnswer;
            potentialAnswer._id = potentialAnswers[i]._id;
            potentialAnswersWithoutCorrectAnswers.push(potentialAnswer);
          }

          questionWithoutCorrectAnswers.potentialAnswers = potentialAnswersWithoutCorrectAnswers;

          return questionWithoutCorrectAnswers;
        });

        var quizWithoutCorrectAnswers = Object.assign({}, quiz._doc);
        quizWithoutCorrectAnswers.questionsList = questionsListWithoutCorrectAnswers;
        // return res.json(questionsListWithoutCorrectAnswers);
        return res.json(quizWithoutCorrectAnswers);
      } else {
        errors.quiz = "Quiz not found";
        return res.status(404).json(errors);
      }
    })
    .catch((err) => {
      console.log("takequiz error", err);
      return res.json(err);
    });
});

// @route GET api/quizzes/getquizanswers/:id
// @desc Get quiz answers by id
// @access Public
router.get("/getquizanswers/:id", (req, res) => {
  var errors = {};

  Quiz.findById(req.params.id)
    .select("-__v -date")
    .then((quiz) => {
      if (quiz) {
        if (isEmpty(quiz.quizCreatorId)) {
          errors.quiz =
            "The quiz data is corrupted and has been deleted. You may take this quiz but rating / reviewing it will not register";
          errors.quizDeletedByServerDueToDataCorruption = true;
          return Quiz.findByIdAndDelete(req.params.id)
            .then((success) => {
              var quizTemp = Object.assign({}, quiz._doc);
              quizTemp.errors = errors;
              return res.json(quizTemp);
            })
            .catch((err) => {
              errors.quiz = "The quiz data is corrupted but the server encountered an error while deleting it.";
              return res.status(500).json(errors);
            });
        } else if (quiz.draft === true) {
          // errors.quiz = "The requested quiz is still a draft";
          errors.quiz = [
            { type: "p", text: "The requested quiz is still a" },
            { type: "span", text: "draft" },
          ];
          return res.status(403).json(errors);
        } else if (quiz.isHidden) {
          // errors.quiz = "The requested quiz was set Hidden by its creator";
          errors.quiz = [
            { type: "p", text: "The requested quiz was set " },
            { type: "span", text: "hidden" },
            { type: "p", text: " by its creator" },
          ];
          return res.status(403).json(errors);
        }

        return res.json(quiz);
        // var questionsListWithoutCorrectAnswers = quiz.questionsList.map(function (question, index) {

        //     var questionWithoutCorrectAnswers = Object.assign({}, question._doc);

        //     var potentialAnswers = questionWithoutCorrectAnswers.potentialAnswers;
        //     var potentialAnswersWithoutCorrectAnswers = [];
        //     for (var i = 0; i < potentialAnswers.length; i++) {
        //         var potentialAnswer = {};
        //         potentialAnswer.potentialAnswer = potentialAnswers[i].potentialAnswer;
        //         potentialAnswer._id = potentialAnswers[i]._id;
        //         potentialAnswersWithoutCorrectAnswers.push(potentialAnswer);
        //     }

        //     questionWithoutCorrectAnswers.potentialAnswers = potentialAnswersWithoutCorrectAnswers;

        //     return questionWithoutCorrectAnswers;
        // });

        // var quizWithoutCorrectAnswers = Object.assign({}, quiz._doc);
        // quizWithoutCorrectAnswers.questionsList = questionsListWithoutCorrectAnswers;
        // // return res.json(questionsListWithoutCorrectAnswers);
        // return res.json(quizWithoutCorrectAnswers);
      } else {
        errors.quiz = "Quiz not found";
        return res.status(404).json(errors);
      }
    })
    .catch((err) => {
      console.log("takequiz error", err);
      return res.json(err);
    });
});

// @route GET api/quizzes/searchquizzes
// @desc Fetches a list of all quizzes (without answers to questions)
// @access Public
router.post("/searchquizzes/", (req, res) => {
  const { courseId, majorId, schoolId, quizTerm, quizCreatorName, searchableId } = req.body;

  // if (quizCreatorName === (undefined || null)) quizCreatorName = '';

  const { errors, isValid } = validateQuizzesSearchInput(req.body);

  // // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // return res.json(errors);

  Quiz.find()
    .then((quizzes) => {
      User.find()
        .then((users) => {
          // User.findOne({ username: quizCreatorName }).select("_id").then(userId => {
          try {
            // var quizMakerId = '';
            // if (userId) quizMakerId = userId.toString();

            var searchResults = searchQuizzes(quizzes, courseId, majorId, schoolId, quizTerm, quizCreatorName, searchableId, users);

            var sortedByRating = searchResults.sort(function (a, b) {
              var x = a.rating.ratingAverage;
              var y = b.rating.ratingAverage;
              return x < y ? 1 : x > y ? -1 : 0;
              // if (x < y) { return -1; }
              // if (x > y) { return 1; }
              // return 0;
            });

            // Remove answers from questions
            for (var i = 0; i < sortedByRating.length; i++) {
              var updatedQuestionsList = sortedByRating[i].questionsList;
              for (var q = 0; q < updatedQuestionsList.length; q++) {
                var updatedPotentialAnswers = updatedQuestionsList[q].potentialAnswers;
                for (var p = 0; p < updatedPotentialAnswers.length; p++) {
                  updatedPotentialAnswers[p].correctAnswer = null;
                }
              }
            }

            return res.json(sortedByRating);
          } catch (err) {
            console.log("searchquizzes err: ", err);
          }
        })
        .catch((err) => {
          return res.json("Unable to load users");
        });

      // }).catch(err => res.status(404).json({ "Error fetching user": err }));
    })
    .catch((err) => {
      console.log("searchquizzes catch err: ", err);
      return res.status(500).json(err);
    });
});

// @route GET api/quizzes/getmyquizzes
// @desc Fetches a list of all current user's quizzes
// @access Private
router.get("/getmyquizzes/", passport.authenticate("jwt", { session: false }), (req, res) => {
  Quiz.find({ quizCreatorId: req.user.id })
    .then((quizzes) => {
      return res.json(quizzes);
    })
    .catch((err) => res.status(500).json(err));
});

// @route GET api/quizzes/getmyquizhistory
// @desc Fetches a list of all current user's taken quizzes history
// @access Private
router.get("/getmyquizhistory/", passport.authenticate("jwt", { session: false }), (req, res) => {
  // console.log("quiz history");

  var errors = {};

  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        errors.user = "User not found";
        return res.status(404).json({ errors });
      }

      Quiz.find()
        .then((quizzes) => {
          try {
            if (isEmpty(user.quizHistory) || user.quizHistory.length < 1) {
              errors.history = "You have yet to take a quiz!";
              return res.status(404).json({ errors });
            }

            // else...

            var quizzesIds = quizzes.map(function (quiz) {
              return quiz._id.toString();
            });

            var userQuizHistory = user.quizHistory;
            // return res.json(userQuizHistory[0].quizId);

            // for (var k = 0; k < userQuizHistory.length; k++) {
            //     console.log(quizzesIds.indexOf(userQuizHistory[k].quizId.toString()));
            // }

            var quizzesNotFound = [];

            var quizHistory = [];
            var quizzesRemoved = 0;
            for (var j = 0; j < user.quizHistory.length; j++) {
              var quizFound = false;
              for (var i = 0; i < quizzes.length; i++) {
                if (quizzes[i]._id.toString() === user.quizHistory[j].quizId.toString()) {
                  // console.log("found");
                  quizFound === true;
                  if (quizzes[i].draft || quizzes[i].isPrivate || quizzes[i].isHidden) {
                    // if (quizzes[i].draft) console.log("skipped a draft");
                    // if (quizzes[i].isPrivate) console.log("skipped a private quiz");
                    // if (quizzes[i].isHidden) console.log("skipped a hidden quiz");
                    quizzesRemoved++;
                    continue;
                  }
                  var quizObj = {
                    quiz: quizzes[i],
                    dateTaken: user.quizHistory[j].timestamp,
                  };
                  quizHistory.push(quizObj);
                }
                if (quizFound === false && i === quizzes.length - 1) {
                  quizzesRemoved++;
                  // console.log("not found");

                  // quizzesNotFound.push(quizzes[i]._id);
                }
              }
            }

            // console.log("count: ", quizzesRemoved);

            // console.log("quizHistory empty? ", isEmpty(quizHistory));

            if (isEmpty(quizHistory) && quizzesRemoved > 0) {
              errors.history = "All of the quizzes you took have been deleted by their respective creators";
              return res.status(410).json({ errors });
            } else if (!isEmpty(quizHistory) && quizzesRemoved > 0) {
              errors.history = "One or more of the quizzes you've taken were deleted by their respective creators";
              // errors.history = "wewewew";
              // return res.status(410).json({ errors });
            }

            quizHistory.sort(function (a, b) {
              var x = a.dateTaken;
              var y = b.dateTaken;
              return x < y ? 1 : x > y ? -1 : 0;
            });
            return res.json({ quizHistory, errors });
          } catch (err) {
            errors.history = "Server error";
            return res.status(500).json({ errors });
          }
        })
        .catch((err) => {
          errors.quiz = "Could not load quizzes";
          return res.status(500).json({ errors, err });
        });
    })
    .catch((err) => {
      errors.user = "Could not load user";
      return res.status(500).json({ errors });
    });
});

// @route POST api/quizzes/getreviewusers
// @desc Fetches a list of display names from user IDs in the provided review list
// @access Public
router.post("/getreviewusers/", (req, res) => {
  // console.log("getreviewusers");
  const { reviews } = req.body;

  User.find()
    .then((users) => {
      reviews.forEach((reviewItem) => {
        try {
          var user = users.filter((userItem) => {
            return userItem._id.toString() === reviewItem.userId.toString();
          });

          if (!isEmpty(user)) {
            reviewItem.displayName = user[0].displayName;
          }
        } catch (err) {
          console.log("getreviewusers try/catch err:", err);
        }
      });

      reviews.sort(function (a, b) {
        var x = a.date;
        var y = b.date;
        return x < y ? 1 : x > y ? -1 : 0;
      });

      return res.json(reviews);
    })
    .catch((err) => {
      console.log("getreviewusers err: ", err);
      return res.status(500).json("Error fetching users");
    });
});

// @route GET api/quizzes/ratequiz
// @desc Rate a quiz and add to user's history
// @access Private
router.post("/ratequiz/", (req, res, next) => {
  var errors = {};

  passport.authenticate("jwt", (err, reqUser, info) => {
    if (err) {
      errors.ratequiz = err;
      return res.status(401).json(errors);
    }

    const userId = reqUser.id;
    const { quizId, quizRating, isUpdate } = req.body;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          errors.ratequiz = "User not found";
          return res.status(404).json(errors);
        } else if (user && user.verified === false) {
          errors.ratequiz = "User not verified";
          return res.status(404).json(errors);
        }
        Quiz.findById(quizId)
          .then((quiz) => {
            try {
              if (!quiz) {
                errors.ratequiz = "Quiz not found";
                return res.status(404).json({ errors });
              }

              if (quiz.quizCreatorId.toString() === userId.toString()) {
                errors.ratequiz = "A quiz cannot be rated by its creator";
                return res.status(404).json({ errors });
              }

              if (quiz.draft) {
                errors.ratequiz = "A draft cannot be rated";
                return res.status(404).json({ errors });
              }

              if (quiz.isHidden) {
                errors.ratequiz = "A hidden quiz cannot be rated";
                return res.status(404).json({ errors });
              }

              var newRating = {
                userId,
                rate: quizRating,
              };

              var quizRatingObject = quiz.rating;
              if (isUpdate) {
                quizRatingObject.ratingArray.map((ratingObj) => {
                  if (ratingObj.userId.equals(reqUser.id)) {
                    ratingObj.rate = quizRating;
                  }

                  return ratingObj;
                });
              } else quizRatingObject.ratingArray.push(newRating);

              // Calculate average
              var ratingSum = 0;
              for (var i = 0; i < quizRatingObject.ratingArray.length; i++) {
                ratingSum += quizRatingObject.ratingArray[i].rate;
              }

              quizRatingObject.ratingAverage = ratingSum / quizRatingObject.ratingArray.length;

              quiz.rating = quizRatingObject;
              quiz
                .save()
                .then((savedQuiz) => {
                  if (
                    isEmpty(
                      user.quizHistory.filter((quizHistoryObj) => {
                        return quizHistoryObj.quizId.equals(quizId.toString());
                      })
                    )
                  ) {
                    var quizHistoryObj = {
                      timestamp: Date.now(),
                      quizId,
                    };

                    user.quizHistory.push(quizHistoryObj);
                    user
                      .save()
                      .then((savedUser) => {
                        return res.json(quizRating);
                      })
                      .catch((err) => {
                        return res.status(500).json("Quiz rating was updated but entry could not be added to user's quiz history");
                      });
                  }
                })
                .catch((err) => {
                  return res.json("Could not update quiz rating nor add an entry to user's quiz history");
                });
            } catch (err) {
              console.log("Rate quiz error: ", err);
            }
          })
          .catch((err) => {
            errors.ratequiz = "Server error (quiz)";
            return res.status(500).json({ errors, err });
          });
      })
      .catch((err) => {
        errors.ratequiz = "Server error (user)";
        return res.status(500).json({ errors, err });
      });
  })(req, res, next);
});

// @route POST api/quizzes/addquizreview
// @desc Add / edit / delete review
// @access Private
router.post("/addquizreview/", (req, res) => {
  var errors = {};

  passport.authenticate("jwt", (err, reqUser, info) => {
    if (err) {
      errors.review = err;
      return res.status(401).json(errors);
    }

    var { isValid, errors: _errors, data } = validateReview(req.body);
    errors = _errors;

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { quizId, reviewText, operationType } = req.body;
    const userId = reqUser.id;

    Quiz.findById(quizId)
      .then((quiz) => {
        try {
          if (!quiz) {
            errors.review = "Quiz not found";
            return res.status(404).json({ errors });
          }

          if (!reqUser.quizHistory.find((quizHistoryItem) => quizHistoryItem.quizId.equals(quizId))) {
            errors.review = "Cannot review a quiz you have not taken";
            return res.status(404).json({ errors });
          }

          if (isEmpty(operationType) || (!isEmpty(operationType) && operationType !== "delete")) {
            if (quiz.draft) {
              errors.review = "A draft cannot be reviewed";
              return res.status(404).json({ errors });
            }

            if (quiz.isHidden) {
              errors.review = "A hidden quiz cannot be reviewed";
              return res.status(404).json({ errors });
            }

            if (quiz.quizCreatorId.toString() === userId.toString()) {
              errors.review = "A quiz owner cannot review their own quiz";
              return res.status(404).json({ errors });
            }
          }

          if (!isEmpty(operationType) && operationType === "delete") {
            console.log("deletion operation: ", operationType);

            // remove review from quiz
            quiz.reviews = quiz.reviews.filter((review) => {
              return review.userId.toString() !== userId.toString();
            });

            // remove rating
            quiz.rating.ratingArray = quiz.rating.ratingArray.filter((rating) => {
              return rating.userId.toString() !== userId.toString();
            });

            // update rating average
            if (isEmpty(quiz.rating.ratingArray)) quiz.rating.ratingAverage = 0;
            else
              quiz.rating.ratingAverage =
                quiz.rating.ratingArray.map((ratingObj) => ratingObj.rate).reduce((accumulator, current) => accumulator + current) /
                quiz.rating.ratingArray.length;
          } else {
            // console.log("update operation: ", operationType);
            // review doesn't exist

            var quizReviews = quiz.reviews;
            var myReview = quizReviews.filter((reviewObj) => {
              return reviewObj.userId.toString() === userId.toString();
            });

            if (isEmpty(myReview)) {
              const reviewObj = {
                review: reviewText,
                userId,
              };
              quizReviews.push(reviewObj);
            }

            // review exists, but make sure the reviewText doesn't match (i.e. content is new/different)
            else {
              myReview = myReview[0];

              if (String(myReview.review).localeCompare(reviewText) !== 0 && !isEmpty(reviewText)) {
                myReview.review = reviewText;
                myReview.lastEdited = Date.now();

                quizReviews = quizReviews.map((review) => {
                  if (review.userId.toString() === userId.toString()) {
                    return myReview;
                  } else return review;
                });
              } else if (isEmpty(String(reviewText).trim())) {
                // if reiewText is null, it means remove the review, if it's the same, don't make any changes
                quizReviews = quizReviews.filter((review) => review.userId.toString() != userId.toString());
              }
            }
            quiz.reviews = quizReviews;
          }
        } catch (err) {
          console.log("err: ", err);
        }

        quiz
          .save()
          .then((savedQuiz) => {
            // send updated review object
            var myReview = savedQuiz.reviews.filter((review) => {
              return review.userId.toString() === userId.toString();
            })[0];

            return res.json(myReview);
            // return res.json(savedQuiz);
          })
          .catch((err) => {
            errors.review = "Could not add/edit review";
            return res.status(500).json({ errors });
          });
      })
      .catch((err) => {
        errors.review = "Quiz could not be loaded";
        return res.status(500).json({ errors });
      });
  })(req, res);
});

// @route GET api/quizzes/arequizzeshidden
// @desc Find out whether user's posted quizzes are hidden
// @access Private
router.get("/arequizzeshidden/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var errors = {};

  User.findById(req.user.id).then((user) => {
    if (!user) return res.status(404).json({ errors });

    if (isEmpty(user.quizzesHidden) || user.quizzesHidden === false) {
      return res.json(false);
    } else return res.json(true);
  });
});

// @route POST api/quizzes/hidemyquizzes
// @desc Hide or unhide posted quizzes
// @access Private
router.post("/hidemyquizzes/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var errors = {};

  const { hideMyQuizzes } = req.body;

  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        errors.user = "User not found";
        return res.status(404).json({ errors });
      }

      user.quizzesHidden = hideMyQuizzes;
      user
        .save()
        .then((savedUser) => {
          return res.json("Updated");
        })
        .catch((err) => {
          errors.user = "Error hiding quizzes";
        });
    })
    .catch((err) => {
      errors.user = "Server error loading user";
      return res.status(500).json({ errors });
    });
});

// @route GET api/quizzes/getquizdraft
// @desc Fetch a single quiz draft
// @access Private
router.get("/getquizdraft/:qid", passport.authenticate("jwt", { session: false }), (req, res) => {
  const qid = req.params.qid;

  try {
    var errors = {};

    Quiz.findById(qid)
      .then((quiz) => {
        if (quiz) {
          /*
                        One time upon creating a quiz I got a "User not found" error, maybe due to a bad internet connection at the moment.
                        Consequently this created the quiz WITHOUT a quizCreatorId. This would cause a crash when searching for the quiz in SearchQuiz, and it wouldn't load
                        in the creator's MyQuizzes page.
                        The code below removes quizzes that have no quizCreatorId.
                    */
          if (isEmpty(quiz.quizCreatorId)) {
            errors.draft = "The quiz data is corrupted and has been deleted. Its contents can be recovered below";

            return Quiz.findByIdAndDelete(qid)
              .then((success) => {
                var quizTemp = Object.assign({}, quiz._doc);
                quizTemp.errors = errors;
                return res.json(quizTemp);
              })
              .catch((err) => {
                errors.draft = "The quiz data is corrupted but the server encountered an error while deleting it.";
                return res.status(500).json(errors);
              });
          } else if (quiz.quizCreatorId != req.user.id) {
            errors.draft = "Unauthorized draft request. You're probably not the creator.";
            return res.status(403).json(errors);
          }

          return res.json(JSON.stringify(quiz));
        } else {
          return res.json(null);
        }
      })
      .catch((err) => {
        errors.draft = "A server error occurred while fetching the draft";
        return res.status(500).json(errors);
      });
  } catch (err) {
    console.log("err: ", err);
  }
});

// @route POST api/quizzes/getquiz
// @desc Fetches quiz by input parameters (name and/or address)
// @access Public
router.post("/getquiz/", (req, res) => {
  var error = {};

  var { quizName, quizAddress } = req.body;
  if (!quizName) {
    quizName = "";
  }
  if (!quizAddress) {
    quizAddress = {};
  }
  if (!quizAddress.country) {
    quizAddress.country = "";
  }
  if (!quizAddress.city) {
    quizAddress.city = "";
  }

  Quiz
    .find
    // {$or: [
    //     { name: quizName }, { 'address.country': /`${quizAddress.country}`/i }, { 'address.city': quizAddress.city }
    // ]}
    ()
    .select("-_id name address")
    .then((quizzes) => {
      if (quizzes) {
        try {
          var searchResults = searchQuizzes(quizzes, quizName, quizAddress);
          if (searchResults.length > 0) {
            return res.json(searchResults);
          } else {
            error.quizzes = "No quizzes found with such keywords";
            return res.status(404).json(error);
          }
        } catch (err) {
          console.log("error: ", err);
        }
      } else {
        return res.status(404).json("No quiz(s) found with entered parameters");
      }
    })
    .catch((err) => res.json(err));
});

// @route POST api/quizzes/addquiz
// @desc Add a quiz
// @access Private
router.post("/addquiz/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var error = {};

  /* 
            On the frontend, when the user types the name of the relevant course, field of study (Major), and school,
            he will be shown a suggestion of those elements if they already exist in the database (and have already been 
            entered by other users). If the user selects a suggestion, as he should, the quiz will be tied to the ID of
            that element. Otherwise, in order to complete the quiz creation process, the user will be required to create
            a new Course and/or School object in the database. The user will be instructed and advised to enter the full
            names of elements and make them as detailed, self-describing, and clear as possible.
            */

  // // Required elements:
  // const { quizName, schoolBody, majorBody, courseBody, questionsList, quizCreatorName } = req.body;

  // // Optional elements:
  // const { teacherName, quizTerm } = req.body;

  // majorBody should be taken from course object (on the front end).

  var { isValid, errors, data } = validateAddQuizComponents(req.body);

  var creatorId = req.body;
  // console.log("quiz creator id: ", creatorId);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  var {
    quizName,
    schoolBody,
    majorBody,
    courseBody,
    questionsList,
    quizCreatorName,
    teacherName,
    quizTerm,
    quizId,
    quizCreatorId,
    searchableId,
  } = data;

  // return res.json(questionsList[0].question);

  var quizData = {};

  var errors = {};
  errors.addquiz = "";
  Quiz.find()
    .then((quizzes) => {
      User.findById(quizCreatorId)
        .select("_id")
        .then((userId) => {
          if (!userId) return res.status(404).json("User not found");
        })
        .catch((err) => {
          errors.addquiz = "Error finding user";
          return res.json({ errors });
        })
        .then((userPartDone) => {
          return School.find()
            .then((schools) => {
              var schoolName = schoolBody.name;

              var schoolMatch = schools.filter((school) => school.name.toLowerCase() === schoolName.toLowerCase());
              if (!isEmpty(schoolMatch)) {
                quizData.schoolBody = {
                  name: schoolMatch[0].name,
                  id: schoolMatch[0]._id,
                };
                return quizData;
              } else {
                const newSchool = new School({
                  name: schoolName,
                });
                return newSchool
                  .save()
                  .then((schoolAdded) => {
                    quizData.schoolBody = {
                      name: schoolAdded.name,
                      id: schoolAdded._id,
                      new: true,
                    };
                    return quizData;
                  })
                  .catch((err) => {
                    errors.addquiz = "Error creating a new school object";
                    return res.json({ errors });
                  });
              }
            })
            .catch((err) => {
              errors.addquiz = "Error fetching schools";
              return res.json({ errors });
            });
        })
        .then((schoolPartDone) => {
          // schoolPartDone contains quizData object's info and its name describes the current stage in the function.
          // return schoolPartDone;

          // While at this point the program doesn't allow users to add fields of study / majors, I might add it in the future.
          // So for now I must just take the data provided and continue.

          // Validate that data is real.
          return Major.findOne({ name: majorBody.name })
            .then((major) => {
              if (major) {
                quizData.majorBody = {
                  id: major._id,
                  name: major.name,
                };
              } else {
                quizData.majorBody = null;
              }
              return quizData;
            })
            .catch((err) => {
              errors.addquiz = "Error finding major";
              return res.json({ errors });
            });
        })
        .then((majorPartDone) => {
          // return majorPartDone;

          return Course.find()
            .then((courses) => {
              var courseMatch = courses.filter((course) => {
                return (
                  course.code.letters == courseBody.letters &&
                  course.code.digits === courseBody.digits &&
                  course.title.toLowerCase() === mTrim(courseBody.title.toLowerCase()).trim()
                );
              });

              // return courseMatch[0];

              if (!isEmpty(courseMatch)) {
                // return "done";
                courseMatch = courseMatch[0];
                quizData.courseBody = {
                  id: courseMatch._id,
                  title: courseMatch.title,
                  letters: courseMatch.code.letters,
                  digits: courseMatch.code.digits,
                };
                return quizData;
              } else {
                const newCourse = new Course({
                  title: courseBody.title,
                  code: {
                    letters: courseBody.letters,
                    digits: courseBody.digits,
                  },
                  major: {
                    id: majorPartDone.majorBody.id,
                    name: majorPartDone.majorBody.name,
                  },
                  school: {
                    id: majorPartDone.schoolBody.id,
                    name: majorPartDone.schoolBody.name,
                  },
                });

                return newCourse
                  .save()
                  .then((addedCourse) => {
                    quizData.courseBody = {
                      id: addedCourse._id,
                      title: addedCourse.title,
                      letters: addedCourse.code.letters,
                      digits: addedCourse.code.digits,
                    };
                    return quizData;
                  })
                  .catch((err) => {
                    errors.addquiz = "Error creating a new Course object";
                    return res.json({ errors });
                  });
              }
            })
            .catch((err) => {
              errors.addquiz = "Error fetching courses";
              return res.json({ errors });
            });
        })
        .then((coursePartDone) => {
          // return res.json(coursePartDone);

          // Since majors cannot be added by the user (at least for now), the app has to check whether the provided major/field of study
          // exists in the DB.
          if (isEmpty(coursePartDone.majorBody || coursePartDone.majorBody.id)) {
            errors.addquiz += "Such field of study does not exist";
            return res.json({ errors });
          }

          // If we're finishing off a draft,
          var newSearchableId;
          if (!isEmpty(searchableId)) {
            newSearchableId = searchableId;
          } else {
            newSearchableId = generateUniqueID();

            while (
              !isEmpty(
                quizzes.filter((quiz) => {
                  quiz.searchableId === newSearchableId;
                })
              )
            ) {
              newSearchableId = generateUniqueID();
            }
          }

          // console.log("newSearchableId: ", newSearchableId);

          const newQuiz = new Quiz({
            name: quizName,
            teacherName: teacherName,
            course: {
              id: coursePartDone.courseBody.id,
              code: {
                letters: coursePartDone.courseBody.letters.toUpperCase(),
                digits: coursePartDone.courseBody.digits,
              },
              title: coursePartDone.courseBody.title,
            },
            major: {
              id: coursePartDone.majorBody.id,
              name: coursePartDone.majorBody.name,
            },
            school: {
              id: coursePartDone.schoolBody.id,
              name: coursePartDone.schoolBody.name,
            },
            questionsList,
            term: {
              season: quizTerm.season,
              year: quizTerm.year,
            },
            draft: false,
            quizCreator: req.user.displayName,
            quizCreatorUsername: req.user.username,
            quizCreatorId,
            searchableId: newSearchableId,
          });

          newQuiz
            .save()
            .then((quiz) => {
              if (quiz) {
                Quiz.findByIdAndDelete(quizId)
                  .then((deleted) => {
                    return res.json(deleted);
                    // return res.json(quiz._id)
                  })
                  .catch((err) => {
                    return res.status(500).json("Quiz was created but the draft could not be removed");
                  });
              }
            })
            .catch((err) => {
              errors.addquiz = "Error creating quiz, format is probably wrong";
              return res.status(500).json({ errors });
            });
        });
    })
    .catch((err) => {
      return res.status(500).json("Error loading quizzes");
    });
}); // add a new quiz

// @route POST api/quizzes/addquizdraft
// @desc Add/update a quiz draft
// @access Private
router.post("/addquizdraft/", passport.authenticate("jwt", { session: false }), (req, res) => {
  console.log("saving draft");
  var { isValid, errors, data } = validateAddQuizDraftComponents(req.body);

  // Check validation
  // if (!isValid) {
  //     return res.status(400).json(errors);
  // }

  var { quizCreatorId, quizId, quizName, schoolBody, majorBody, courseBody, questionsList, teacherName, quizTerm, searchableId } = data;

  // console.log("question: ", questionsList[0].question);

  if (!isEmpty(quizCreatorId) && quizCreatorId.toString() != req.user.id.toString()) {
    errors.draft = "Unauthorized draft request. You are not the creator of this quiz.";
    return res.status(500).json(errors);
  } else {
    // console.log("IDs match supposedly, I'm continuing");
  }

  // Elements:
  //  quizName, schoolBody, majorBody, courseBody, questionsList, quizCreatorName, teacherName, quizTerm

  return Quiz.find()
    .then((quizzes) => {
      var myDrafts = quizzes.filter((quiz) => quiz.draft === true && quiz.quizCreator === req.user.displayName);

      var quizMatch = myDrafts.filter((quiz) => {
        try {
          // Debugging code:
          // console.log("\nquiz: \n", quiz);
          // , schoolBody, majorBody, courseBody, questionsList, quizCreatorName, teacherName, quizTerm
          // if (quizName != quiz.name) console.log("fail on quizName"); else console.log("success on quizName")
          // if (schoolBody.name != quiz.school.name) console.log("fail on school name"); else console.log("success on school name")
          // if (majorBody.name != quiz.major.name) console.log("fail on major name"); else console.log("success on major name")
          // if (isEmpty(courseBody.code.letters)) console.log("courseBody code letters is empty");
          // if (isEmpty(courseBody.code.digits)) console.log("courseBody code letters is empty");
          // if (isEmpty(courseBody.title)) console.log("courseBody title is empty");
          // if (isEmpty(quiz.course.code.letters)) console.log("quiz code letters is empty");
          // if (isEmpty(quiz.course.code.digits)) console.log("quiz code digits is empty");
          // if (isEmpty(quiz.course.code.title)) console.log("quiz course title is empty");
          // if (courseBody.code.letters != quiz.course.code.letters) console.log("fail on code letters"); else console.log("success on code letters")
          // if (courseBody.code.digits != quiz.course.code.digits) console.log("fail on  code digits"); else console.log("success on  code digits")
          // if (courseBody.title != quiz.course.title) console.log("fail on course title"); else console.log("success on course title")
          // if (JSON.stringify(questionsList) != JSON.stringify(quiz.questionsList)) console.log("fail on questions list "); else console.log("success on questions list ")
          // if (teacherName != quiz.teacherName) console.log("fail on teacherName"); else console.log("success on teacherName")
          // if (quizTerm.season != quiz.term.season) console.log("fail on term season"); else console.log("success on term season")
          // if (quizTerm.year != quiz.term.year) console.log("fail on term year"); else console.log("success on term year")
          // end of debugging code
        } catch (err) {
          console.log("trycatch err: ", err);
        }

        if (
          quizName === quiz.name &&
          schoolBody.name === quiz.school.name &&
          majorBody.name === quiz.major.name &&
          courseBody.code.letters === quiz.course.code.letters &&
          courseBody.code.digits === quiz.course.code.digits &&
          courseBody.title === quiz.course.title &&
          JSON.stringify(questionsList) === JSON.stringify(quiz.questionsList) &&
          teacherName === quiz.teacherName &&
          quizTerm.season === quiz.term.season &&
          quizTerm.year === quiz.term.year
        )
          return true;
        else return false;
      });

      if (!isEmpty(quizMatch)) {
        return "Double update intercepted";
      }
    })
    .catch((err) => {})
    .then((intercepted) => {
      if (intercepted === "Double update intercepted") return res.status(400).json(intercepted);

      return Quiz.findById(quizId).then((quiz) => {
        // If draft exists, update contents
        if (!isEmpty(quiz)) {
          quiz.name = quizName;
          quiz.school = schoolBody;
          quiz.major = majorBody;
          quiz.course = courseBody;
          quiz.questionsList = questionsList;
          quiz.quizCreator = req.user.displayName;
          quiz.teacherName = teacherName;
          quiz.term = quizTerm;

          return quiz
            .save()
            .then((quiz) => {
              return res.json(quiz);
            })
            .catch((err) => {
              console.log("update draft err:", err);
              return res.status(500).json(err);
            });
        } else {
          // If draft doesn't exist, create one.
          const newQuiz = new Quiz({
            name: quizName,
            school: schoolBody,
            major: majorBody,
            course: courseBody,
            questionsList: questionsList,
            quizCreator: req.user.displayName,
            quizCreatorId: req.user.id,
            teacherName: teacherName,
            term: quizTerm,
            draft: true,
            searchableId,
          });

          return newQuiz
            .save()
            .then((quiz) => {
              return res.json(quiz);
            })
            .catch((err) => {
              console.log("create draft err:", err);
              return res.status(500).json(err);
            });
        }
      });
    });
});

// @route POST api/quizzes/addquizdraft
// @desc Add/update a quiz draft
// @access Private
router.post("/editpostedquiz/", passport.authenticate("jwt", { session: false }), (req, res) => {
  // This route makes an already-posted quiz editable again but it essentially renders it as a new quiz altogether.
  // This means its rating is getting reset and hence it will be removed from users' quiz history.

  var errors = {};
  const { quizId } = req.body;

  Quiz.findById(quizId)
    .then((quiz) => {
      if (quiz) {
        if (quiz.quizCreatorId != req.user.id) {
          errors.quiz = "Unauthorized request. You are not the creator of this quiz.";
          return res.status(403).json({ errors });
        }

        // Set draft to true
        quiz.draft = true;
        // Reset rating
        quiz.rating = {};

        quiz
          .save()
          .then((savedQuiz) => {
            /* Remove quiz from hitory of users who took it:
                       While the code below works, I decided not to use it because it unneccessarily loads the server when the users array is large.
                       An alternative, more performance friendly solution is:
                       When a user loads their quiz history, the server shall filter out quizzes from their history that are drafts, private, hidden, or don't exist anymore.

                       In a nutshell, when a quiz creator edits a posted quiz, they don't need to announce that to the entire userbase. When a user who's taken that quiz previously
                       tries to load their history, the server will let the user know that that quiz has been removed.
                    */

            // return User.updateMany(
            //     { "quizHistory.quizId": quizId },
            //     { $pull: { quizHistory: { quizId: quizId } } }
            // ).then(results => {
            //     var savedQuizObj = Object.assign({}, savedQuiz);
            //     var resultsObj = Object.assign({}, savedQuizObj._doc);
            //     resultsObj.queryResults = results;
            //     return res.status(200).json(resultsObj);
            // })
            //     .catch(err => {
            //         // return res.status(500).json({ "updatemany error": err });
            //         return res.status(500).json({ "Error upon deleting quiz from takers' history": err });
            //     })

            return res.status(200).json(savedQuiz);
          })
          .catch((err) => {
            return res.status(500).json("Server error upon updating quiz");
          });
      } else {
        return res.status(404).json("Quiz not found");
      }
    })
    .catch((err) => {
      // return res.status(500).json({ "Server error": err });
      return res.status(500).json("Server error");
    });
});

// @route POST api/quizzes/setquizaccessibility
// @desc Update a quiz's accessibility mode (1 = accesible to all, 2 = accessible only by searchable quiz ID, 3 = accessible only to its creator)
// @access Private
router.post("/setquizaccessibility/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var errors = {};
  const { quizId, mode } = req.body;

  // res.json({quizId, mode});
  // console.log("reqbody: ", {quizId, mode})

  Quiz.findById(quizId)
    .then((quiz) => {
      if (quiz) {
        if (quiz.quizCreatorId != req.user.id) {
          errors.quiz = "Unauthorized request. You are not the creator of this quiz.";
          return res.status(403).json({ errors });
        }

        if (Number(mode) === 1) {
          quiz.isPrivate = false;
          quiz.isHidden = false;
        } else if (Number(mode) === 2) {
          quiz.isPrivate = true;
          quiz.isHidden = false;
        } else if (Number(mode) === 3) {
          quiz.isPrivate = false;
          quiz.isHidden = true;
        }

        quiz
          .save()
          .then((savedQuiz) => {
            // return res.json(savedQuiz);
            return res.json("success");
          })
          .catch((err) => {
            return res.status(500).json("Server error");
          });
      } else {
        return res.status(404).json("Quiz not found");
      }
    })
    .catch((err) => {
      return res.status(500).json("Server error");
    });
});

// @access Dev
// router.post('/addid', (req, res) => {
//     User.find().then(users => {
//         Quiz.find().then(quizzes => {
//             try {

//                 var requests = [];
//                 quizzes.forEach(quiz => {
//                     requests.push({
//                         'updateOne': {
//                             'filter': { $or: [{ 'quizCreatorId': "" }, { "quizCreatorId": { $exists: false } }] },
//                             'update': { '$set': { 'quizCreatorId': users.filter(user => user.username === quiz.quizCreator)[0]._id } }
//                         }
//                     });
//                     if (requests.length === 500) {
//                         //Execute per 500 operations and re-init
//                         Quiz.bulkWrite(requests);
//                         requests = [];
//                     }
//                 });

//                 if (requests.length > 0) {
//                     Quiz.bulkWrite(requests).then(something => {
//                         return res.json(something);
//                     });
//                 }
//             } catch (err) {
//                 console.log("ERROR: ", err);
//             }

//         }).catch(err => { return res.status(500).json({ "error quiz": err }); })
//     }).catch(err => { return res.status(500).json({ "error user": err }); })
// })

// @route POST api/quizzes/setcreatorname
// @desc Set the creator name of each quiz by quizCreatorId
// @access Dev
// router.post('/setcreatorname', (req, res) => {

//     User.find().then(users => {
//         Quiz.find().then(quizzes => {
//             try {

//                 var requests = [];
//                 quizzes.forEach(quiz => {
//                     requests.push({
//                         'updateOne': {
//                             // 'filter': { "quizCreatorId": { $exists: true } },
//                             'filter': {
//                                 // $and: [
//                                 // {
//                                 quizCreator: { $eq: "" },
//                                 // quizCreator: { $exists: true },
//                                 // }
//                                 // ]
//                             },
//                             'update': {
//                                 '$set': {
//                                     'quizCreator': users.filter(user => {
//                                         return user._id.toString() === quiz.quizCreatorId.toString()
//                                     })[0].displayName
//                                 }
//                             }
//                         }
//                     });
//                     if (requests.length === 500) {
//                         //Execute per 500 operations and re-init
//                         Quiz.bulkWrite(requests);
//                         requests = [];
//                     }
//                 });

//                 if (requests.length > 0) {
//                     Quiz.bulkWrite(requests).then(something => {
//                         return res.json(something);
//                     });
//                 }
//             } catch (err) {
//                 console.log("ERROR: ", err);
//             }

//         }).catch(err => { return res.status(500).json({ "error quiz": err }); })
//     }).catch(err => { return res.status(500).json({ "error user": err }); })
// })

// @access Dev
// router.post('/changecreatorname', (req, res) => {
//     User.find().then(users => {
//         Quiz.find().then(quizzes => {
//             try {

//                 // var obj = {};
//                 // obj.first = users[0];
//                 // obj.second = quizzes[0];
//                 // obj.third = users[0]._id.toString() === quizzes[0].quizCreatorId.toString();

//                 // return res.json(obj);

//                 var requests = [];
//                 quizzes.forEach(quiz => {
//                     requests.push({
//                         'updateOne': {
//                             'filter': { "quizCreatorId": { $exists: true } },
//                             'update': { '$set': { 'quizCreator': users.filter(user => user._id.toString() === quiz.quizCreatorId.toString())[0].displayName } }
//                             // 'update': { '$set': { 'quizCreator': users.filter(user => user.username === quiz.quizCreator)[0]._id } }
//                         }
//                     });
//                     if (requests.length === 500) {
//                         //Execute per 500 operations and re-init
//                         Quiz.bulkWrite(requests);
//                         requests = [];
//                     }
//                 });

//                 if (requests.length > 0) {
//                     Quiz.bulkWrite(requests).then(something => {
//                         return res.json(something);
//                     });
//                 }
//             } catch (err) {
//                 console.log("ERROR: ", err);
//             }

//         }).catch(err => { return res.status(500).json({ "error quiz": err }); })
//     }).catch(err => { return res.status(500).json({ "error user": err }); })
// })

// @route POST api/quizzes/uploadimage
// @desc Uploads an (question) image
// @access Private
router.post(
  "/uploadimage/",
  // , upload.single('questionImage')
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      return upload(req, res, (err) => {
        if (err) {
          console.log("upload err: ", err);
          if (err === "File type incompatible") {
            return res.status(500).json("File type incompatible");
          } else if (String(err).match(new RegExp("large|size", "i"))) {
            return res.status(500).json("File size over 500KB");
          } else return res.status(500).json("File type incompatible");

          // return res.status(500).json({ err });
        } else {
          // console.log("file: ", req.file);
          // console.log("file qINDEX: ", req.body.qINDEX);
          // return res.json("successful");
          var imgObj = {
            path: req.file.path,
            name: req.file.filename,
          };

          return res.json(imgObj);
        }
      });
    } catch (err) {
      console.log("upload catch err: ", err);
    }
  }
);

// @route POST api/quizzes/deleteimage
// @desc Deletes (question) image
// @access Private
router.post("/deleteimage/", passport.authenticate("jwt", { session: false }), (req, res) => {
  var { imageName } = req.body;
  // console.log("imageName: ", imageName);
  return fs.unlink(`./uploads/${imageName}`, function (err) {
    if (err) {
      console.log("remove image error: ", err);
      return res.status(500).json({ "Image could not be removed": err });
    } else return res.json("Image removed");
  });
});

// @route POST api/quizzes/getteachers
// @desc Get a list of teachers' names from existing quizzes
// @access Public
router.get("/getteachers/", (req, res) => {
  Quiz.find().then((quizzes) => {
    var teachersList = [];
    teachersList = quizzes.map((quiz) => {
      return { id: generateUniqueID(), teacherName: quiz.teacherName };
    });
    teachersList = lodash.uniqBy(teachersList, "teacherName");
    // teachersList = removeDuplicates(teachersList)
    console.log("teachers", teachersList);
    return res.json(teachersList);
  });
});

// @route POST api/quizzes/getsearchparams
// @desc Returns the objects associated with the search parameters provided in the URL.
// @access Public
router.post("/getsearchparams", (req, res) => {
  var { courseId, majorId, schoolId } = req.body;

  var items = {};
  return Course.findById(courseId)
    .then((course) => {
      if (course) {
        items.course = course;
      }
      return items;
    })
    .catch((err) => {})
    .then((courseAdded) => {
      return Major.findById(majorId)
        .then((major) => {
          if (major) {
            // console.log("major : ", major);
            courseAdded.major = major;
          }
          return items;
        })
        .catch((err) => {});
    })
    .then((majorAdded) => {
      return School.findById(schoolId)
        .then((school) => {
          if (school) {
            majorAdded.school = school;
          }
          return items;
        })
        .catch((err) => {});
    })
    .then((schoolAdded) => {
      // console.log("length: ", Object.keys(schoolAdded).length);
      return res.json(schoolAdded);
    })
    .catch((err) => res.status(500).json(null));
});

router.delete("/deletequiz/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const quizId = req.params.id;
  Quiz.findById(quizId)
    .then((quizToDelete) => {
      // res.json("Quiz deleted")
      try {
        User.findById(quizToDelete.quizCreatorId)
          .then((user) => {
            if (!user) return res.status(404).json("User not found");
            if (user.id !== req.user.id) return res.status(404).json("Unauthorized");

            quizToDelete
              .delete()
              .then((quizHasBeenDeleted) => {
                Quiz.find({ quizCreator: req.user.displayName })
                  .then((quizzes) => {
                    return res.json(quizzes);
                  })
                  .catch((err) => res.status(500).json({ errText: "Error removing quiz", err }));
              })
              .catch((err) => {});
          })
          .catch((err) => {});
      } catch (err) {
        console.log("err deleting quiz", err);
      }
    })
    .catch((err) => res.status(500).json({ errText: "Error removing quiz", err }));
});

// @route GET api/quizzes/getquizzes
// @desc Fetches a list of all quizzes
// @access Dev
// router.get("/getquizzes/", passport.authenticate("jwt", { session: false }), (req, res) => {
//   if (req.user.username != "test") {
//     return res.json("Unauthorized - Admin only");
//   }

//   Quiz.aggregate([
//     {
//       $facet: {
//         "test1": [{ $skip: 0 }, { $limit: 1 }],
//         "total": [{ $count: "Quiz" }],
//       },
//     },

//     // $facet: {
//     //     $all: [],
//     //     total: [{ $count: 'Quiz' }]
//     // }
//   ])

//     //     .find()
//     //     .limit(1)
//     //     .
//     // // .select({ '_id': 0, 'name': 1, 'address': 1 })
//     // // .select("-_id name address")
//     .then((quizzes) => {
//       return res.json(quizzes);
//     })
//     .catch((err) => res.status(500).json(err));
// });

// @route POST api/quizzes/maintenance
// @desc Removes corrupted quizzes
// @access Dev
// router.post("/maintenance/", (req, res) => {
//   // Removes corrupted quizzes / quizzes without quizCreatorId
//   return Quiz.find({
//     $or: [
//       { quizCreatorId: { $exists: false } },
//       { quizCreatorId: { $eq: "" } },
//       { quizCreatorId: { $eq: null } },
//       { quizCreatorId: { $eq: undefined } },
//     ],
//   })
//     .then((results) => {
//       return res.json(results);
//     })
//     .catch((err) => {
//       return res.status(500).json(err);
//     });
// });

module.exports = router;

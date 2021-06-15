const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      Date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  requests: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      // type: {
      //     type: String,
      //     required: true
      // },
      requestType: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  sentrequests: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      requestType: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  addedschools: {
    // number of schools a person can add to the database
    type: Number,
    default: 0, // max will be 3, users can ask for extension if their scores justify the request
  },
  quizHistory: [
    {
      timestamp: {
        type: Date,
        default: Date.now(),
      },
      quizId: {
        type: Schema.Types.ObjectId,
        ref: "quizzes",
      },
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  quizzesHidden: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    default: Date.now(),
  },
  passwordResetRequestExpirationDate: {
    // point in time before which the user cannot request another password reset. Set 24hr from the moment the email is sent.
    type: Date,
  },
  passwordResetExpirationDate: {
    // point in time before which the user cannot reset their password. Set 10 days from the moment the password is reset.
    type: Date,
  },
  adminMaintenance: [
    {
      objectType: {
        type: String,
      },
      objectId: {
        type: String,
      },
    },
  ],
});

module.exports = User = mongoose.model("users", UserSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const QuizSchema = new Schema({
  name: {
    type: String,
    default: "",
    // required: true
  },
  teacherName: {
    type: String,
    default: "",
    // required: true
  },
  course: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "courses",
      // required: true
    },
    code: {
      letters: {
        type: String,
        default: "",
        // required: true
      },
      digits: {
        type: String,
        default: "",
        // required: true
      },
    },
    title: {
      type: String,
      default: "",
      // required: true
    },
  },
  major: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "majors",
      // required: true
    },
    name: {
      type: String,
      default: "",
      // required: true
    },
  },
  school: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "schools",
      // required: true
    },
    name: {
      type: String,
      default: "",
      // required: true
    },
  },
  questionsList: [
    {
      question: {
        type: String,
        default: "",
        // required: true
      },
      potentialAnswers: [
        {
          potentialAnswer: {
            type: String,
            default: "",
            // required: true
          },
          correctAnswer: {
            type: Boolean,
            default: false,
            // required: true
          },
        },
      ],
      questionImage: {
        path: { type: String },
        name: { type: String },
      },
    },
  ],
  term: {
    year: {
      type: String,
      default: "",
    },
    season: {
      type: String,
      default: "",
    },
  },
  quizCreator: {
    // for client-side quiz search, this is the user's display name (changeable)
    type: String,
    // required: true
  },
  quizCreatorUsername: {
    // for db queries, user's username (unchangeable)
    type: String,
    // required: true
  },
  quizCreatorId: {
    type: String,
    // type: Schema.Types.ObjectId,
    // ref: 'users'
  },
  rating: {
    ratingArray: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "users",
          // required: true
        },
        rate: {
          type: Number,
        },
      },
    ],
    ratingAverage: {
      type: Number,
      default: 0,
    },
  },
  reviews: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      review: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
      lastEdited: {
        type: Date,
      },
    },
  ],
  searchableId: {
    type: String,
  },
  searchableById: {
    type: Boolean,
    default: false,
  },
  draft: { type: Boolean },
  isPrivate: { type: Boolean },
  isHidden: { type: Boolean },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Quiz = mongoose.model("quizzes", QuizSchema);

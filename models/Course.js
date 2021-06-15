const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    letters: {
      type: String,
      required: true,
    },
    digits: {
      type: String,
      required: true,
    },
  },
  major: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "majors",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  school: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Course = mongoose.model("courses", CourseSchema);

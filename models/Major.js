const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MajorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Major = mongoose.model("majors", MajorSchema);

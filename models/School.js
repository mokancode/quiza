const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SchoolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
      // required: true
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      // required: true
    },
    zipcode: {
      type: String,
    },
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = School = mongoose.model("schools", SchoolSchema);

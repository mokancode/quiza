const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ContactSchema = new Schema({
  personone: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  persontwo: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  passwordone: {
    type: String,
  },
  passwordtwo: {
    type: String,
  },

  // If sharedpassword is a String, it means it's a single-layered Contact; If an Array, it means it's a multi-layered Contact.
  sharedpassword: {
    type: Schema.Types.Mixed,
  },
  agreed: {
    type: Boolean,
  },
  requestfrom: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Contact = mongoose.model("contacts", ContactSchema);

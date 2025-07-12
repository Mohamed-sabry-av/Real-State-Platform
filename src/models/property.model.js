const mongoose = require("mongoose");

const properytSchema = new mongoose.Schema({
  apartment: {
    type: String,
    required: true,
  },
  house: {
    type: String,
    required: true,
  },
  condo: {
    type: String,
    required: true,
  },
  land: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("properyt", properytSchema);

const mongoose = require("mongoose");


const PostSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  utilities: {
    type: String,
    required: false,
  },

  pet: {
    type: String,
    required: false,
  },
  income: {
    type: Number,
    required: false,
  },
  size: {
    type: Number,
    required: false,
  },
  school: {
    type: String,
    required: false,
  },
  bus: {
    type: String,
    required: false,
  },
  
});

module.exports = mongoose.model("Post", PostSchema);

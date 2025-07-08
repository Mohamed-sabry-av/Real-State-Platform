const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {},
});

module.exports = mongoose.model("Post", PostSchema);

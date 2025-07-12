const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  bedroom: {
    type: Number,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  propertyType: {
    type: String,
    required: false,
  },
  postType: { // Renamed from `type` to avoid reserved keyword
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type", // Reference to the Type model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming it references a User model
    ref: "User",
    required: true,
  },
  postDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostDetail", // Reference to the PostDetail model
    required: true,
  },
  savedPosts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedPost" }], // Array of references to SavedPost model
    required: false,
    default: [], // Optional: default to empty array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("Post", PostSchema);
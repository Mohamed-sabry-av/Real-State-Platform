const Post = require("../models/post.model");

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.editPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    console.log("deleted");
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

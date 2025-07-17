const Post = require("../models/post.model");
const PostDetail = require("../models/postDetail.model");
const PostType = require("../models/type.model");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("postDetail").populate("postType");

    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};
exports.getPost = async (req, res) => {
  const id = req.params;
  try {
    const post = await Post.findById(req.params.id).populate([
      "postDetail",
      "postType",
    ]);

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};
exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Find the post and check if it exists
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the user is authorized to update this post
    if (post.userId.toString() !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own posts" });
    }

    // Handle post type update if provided
    let postTypeId = post.postType;
    if (body.type && typeof body.type === "string") {
      let postType = await PostType.findOne({ name: body.type });
      if (!postType) {
        postType = await PostType.create({ name: body.type });
      }
      postTypeId = postType._id;
    }

    // Handle post details update if provided
    let postDetailId = post.postDetail;
    if (body.postDetail) {
      // Update existing postDetail document
      await PostDetail.findByIdAndUpdate(post.postDetail, body.postDetail);
    }

    // Update the post with new data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...body,
        postType: postTypeId,
        postDetail: postDetailId,
        // Don't update userId as it should remain the same
      },
      { new: true } // Return the updated document
    )
      .populate("postDetail")
      .populate("postType");

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await PostDetail.findByIdAndDelete(post.postDetail);

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete Post" });
  }
};

exports.addPost = async (req, res) => {
  const body = req.body;
  const userIdToken = req.userId;

  try {
    if (!userIdToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }
    if (!body.type || typeof body.type !== "string") {
      return res.status(400).json({ message: "Invalid type provided" });
    }
    let postType = await PostType.findOne({ name: body.type });
    if (!postType) {
      postType = await PostType.create({ name: body.type });
    }
    const postDetail = await PostDetail.create(body.postDetail);
    const newPost = await Post.create({
      ...body,
      userId: userIdToken,
      postDetail: postDetail._id,
      postType: postType._id,
    });

    const fullPost = await Post.findById(newPost._id)
      .populate("postDetail")
      .populate("postType");

    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

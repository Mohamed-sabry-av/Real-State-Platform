const User = require("../models/user.model");
const SavedPost = require("../models/savedPost.model");
const Post = require("../models/post.model");
const Chat = require("../models/chat.model");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("savedPosts");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) return res.status(401).json("Unauthorized");

  const updateFields = { avatar, ...inputs };
  try {
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      $set: updateFields
    }, { new: true });


    const { password: userPassword, ...rest } = updateUser;
    res.status(200).json(rest);
  } catch (err) {
    console.log("cant update user");
    res.status(500).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.savePost = async (req, res) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;

  try {
    const user = await User.findById(tokenUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const savedPost = await SavedPost.findOne({ userId: tokenUserId, postId });

    if (savedPost) {
      // delete SavedPost
      await SavedPost.deleteOne({ _id: savedPost._id });

      // remove postId from User's savedPosts array
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
      await user.save();

      return res.status(200).json({ message: "Post has been removed from saved posts" });
    } else {
      await SavedPost.create({ userId: tokenUserId, postId });

      // add postId to User's savedPosts array
      user.savedPosts.push(postId);
      await user.save();

      return res.status(200).json({ message: "Post has been saved" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const userPosts = await Post.find({ userId: tokenUserId })
    const savedPostsRecord = await SavedPost.find({ userId: tokenUserId })
    const savedPosts = savedPostsRecord.map(post => post.postId)

    res.status(200).json({ userPosts, savedPosts })
  } catch (err) {
    console.error("Error in profilePosts:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

exports.getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await Chat.find({
      userIDs: { $in: [tokenUserId] }
    });
    const number = chats.length;
    res.status(200).json({ notificationCount: number });
  } catch (err) {
    console.error("Error in getNotificationNumber:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

const User = require("../models/user.model");
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
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
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

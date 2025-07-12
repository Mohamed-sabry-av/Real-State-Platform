const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const e = require("express");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully",
      // user: newUser,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // console.log(user.password);
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Password is wrong" });
    }

    const age = 1000 * 60 * 60 * 24 * 7;
    const isAdmin = false;
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: age }
    );

    // Set cookies and headers
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        // secure: true, // only in Production for HTTPS
      })
      .status(200)
      .json({
        message: "Login successful",
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
};

const express = require("express");
const router = express.Router();
const Post = require("../controller/post.controller");
const {verifyToken} = require("../middleware/verifyToken");

router.post("/", verifyToken, Post.addPost);
router.get("/", Post.getPosts);
router.get("/:id", verifyToken, Post.getPost);
router.put("/:id", verifyToken, Post.updatePost);
router.delete("/:id", verifyToken, Post.deletePost);
module.exports = router;

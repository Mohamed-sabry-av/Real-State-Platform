const express = require("express");
const router = express.Router();
const Post = require("../controller/post.controller");

router.post("/", Post.createPost);
router.get("/", Post.getPost);
router.get("/:id", Post.getPostById);
router.put("/:id", Post.editPost);
router.delete("/:id", Post.deletePost);
module.exports = router;

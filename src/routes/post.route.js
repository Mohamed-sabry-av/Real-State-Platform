const express = require("express");
const router = express.Router();
const Post = require("../controller/post.controller");

router.post("/", Post.addPost);
router.get("/", Post.getPosts);
router.get("/:id", Post.getPost);
router.put("/:id", Post.updatePost);
router.delete("/:id", Post.deletePost);
module.exports = router;

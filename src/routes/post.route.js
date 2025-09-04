const express = require("express");
const router = express.Router();
const Post = require("../controller/post.controller");
const {verifyToken} = require("../middleware/verifyToken");
const upload = require("../config/multer.config");

// Multiple file uploads for post images
router.post("/", verifyToken, upload.array('images', 5), Post.addPost);
router.get("/", Post.getPosts);
router.get("/filter-options", Post.getFilterOptions);
router.get("/:id", verifyToken, Post.getPost);
router.put("/:id", verifyToken, upload.array('images', 5), Post.updatePost);
router.delete("/:id", verifyToken, Post.deletePost);
module.exports = router;

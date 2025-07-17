const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.controller");
const { verifyToken } = require("../middleware/verifyToken");

// Apply verifyToken middleware to all chat routes
router.use(verifyToken);

// Chat routes
router.post("/", chatController.createChat);
router.get("/", chatController.getChats);
router.delete("/:id", chatController.deleteChat);
router.get("/:id", chatController.getChat);

module.exports = router;

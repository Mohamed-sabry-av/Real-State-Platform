const express = require("express");
const router = express.Router();
const messageController = require("../controller/message.controller")
const { verifyToken } = require("../middleware/verifyToken");

// Apply verifyToken middleware to all chat routes
router.use(verifyToken);

// Chat routes
// router.post("/", chatController.createChat);
// router.get("/", chatController.getUserChats);
router.post("/:id", messageController.addMessage);
// router.get("/:chatId/messages", chatController.getChatMessages);

module.exports = router;
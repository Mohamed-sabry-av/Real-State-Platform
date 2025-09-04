const express = require("express");
const router = express.Router();
const messageController = require("../controller/message.controller")
const { verifyToken } = require("../middleware/verifyToken");
const upload = require("../config/multer.config");

// Apply verifyToken middleware to all chat routes
router.use(verifyToken);

// Message routes
// Add message with optional file attachment
router.post("/:id", upload.single('attachment'), messageController.addMessage);

// Uncomment and implement these routes as needed
// router.get("/chat/:chatId", messageController.getChatMessages);
// router.delete("/:id", messageController.deleteMessage);

module.exports = router;
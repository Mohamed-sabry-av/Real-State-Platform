const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

exports.addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  const text = req.body.text || '';

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    });

    if (!chat) return res.status(400).json({ message: "Chat not found" });

    // Create message object
    const messageData = {
      chatId,
      userId: tokenUserId,
      text: text,
    };

    // Handle file attachment if present
    if (req.file) {
      messageData.attachment = `/uploads/messages/${req.file.filename}`;
      
      // Determine attachment type based on mimetype
      const mimeType = req.file.mimetype;
      if (mimeType.startsWith('image/')) {
        messageData.attachmentType = 'image';
      } else if (mimeType.startsWith('application/')) {
        messageData.attachmentType = 'document';
      } else {
        messageData.attachmentType = 'other';
      }
    }

    // Validate that either text or attachment is provided
    if (!text && !req.file) {
      return res.status(400).json({ message: "Message must contain either text or an attachment" });
    }

    // Create Message
    const message = await Message.create(messageData);

    // Update chat with last message
    const lastMessageText = text || `Sent a ${messageData.attachmentType || 'file'}`;
    await Chat.findByIdAndUpdate(chatId, {
      $pull: {
        seenBy: tokenUserId,
      },
      lastMessage: lastMessageText,
    });

    const populatedMessage = await Message.findById(message._id)
    .populate("userId","name email image")
    

    if(global.io){
      global.io.to(chatId).emit("recevice-message", populatedMessage);
    }
    res.status(200).json(message);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ message: "Failed to add Message", error: err.message });
  }
};

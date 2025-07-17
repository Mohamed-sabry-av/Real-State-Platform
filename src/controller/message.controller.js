const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

exports.addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  const text = req.body.text;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    });
    console.log(chat)

    if (!chat)res.status(400).json({ message: "Chat not found" });

    // create Message
    const message = await Message.create({
      chatId,
      userId: tokenUserId,
      text: text,
    });

    await Chat.findByIdAndUpdate(chatId, {
      $pull: {
        seenBy: tokenUserId,
        lastMessage: text,
      },
    });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to add Message", err: err.message });
  }
};

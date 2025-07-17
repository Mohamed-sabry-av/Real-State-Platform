const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

exports.createChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const existingChat = await Chat.findOne({
      userIDs: { $all: [tokenUserId, req.body.receiverId] },
    });
    if (existingChat) {
      res.status(404).json("existed Chat");
    } else {
      const newChat = await Chat.create({
        userIDs: [tokenUserId, req.body.receiverId],
      });
      res.status(200).json(newChat);
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create Chat", err: err.message });
  }
};

exports.getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  try {
    const chats = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    })
      .populate({
        path: "messages",
        populate: {
          path: "userId",
          select: "name email image",
        },
      })
      .sort({ updatedAt: -1 });

    await Chat.updateOne(
      {
        _id: chatId,
        userIDs: tokenUserId,
      },
      {
        $set: {
          seenBy: tokenUserId,
        },
      }
    );
    res.status(200).json(chats);
  } catch (err) {
    res.status(400).json({ message: "Failed to get Chat", err: err.message });
  }
};

exports.readChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, {
      $set: {
        seenBy: tokenUserId,
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json({ message: "Failed to read Chat", err: err.message });
  }
};


exports.getChats = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chats = await Chat.find({
            userIDs: tokenUserId,
        })
        res.status(200).json(chats);
    } catch (err) {
        res.status(400).json({ message: "Failed to get Chats", err: err.message });
    }
};

exports.deleteChat = async (req,res) =>{
    const tokenUserId = req.userId;
    try {
        await Chat.findByIdAndDelete(req.params.id,{
            userIDs: tokenUserId,
        })
        res.status(200).json("Chat deleted");
    } catch (err) {
        res.status(400).json({ message: "Failed to delete Chat", err: err.message });
    }
}
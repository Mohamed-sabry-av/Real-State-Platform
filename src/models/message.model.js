const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({

  text: {
    type: String,
    required: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
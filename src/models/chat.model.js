const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({

  userIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  lastMessage: {
    type: String,
    required: false
  },
  
}, { timestamps: true });

// Virtual for messages relationship
ChatSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chatId"
});

// Make sure virtuals are included when converting to JSON
ChatSchema.set("toJSON", { virtuals: true });
ChatSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Chat", ChatSchema);

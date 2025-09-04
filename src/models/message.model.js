const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({

  text: {
    type: String,
    required: function() {
      return !this.attachment; // Text is required only if there's no attachment
    }
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
  },

  attachment: {
    type: String, // Path to the uploaded file
    required: function() {
      return !this.text; // Attachment is required only if there's no text
    }
  },

  attachmentType: {
    type: String, // Type of attachment (image, document, etc.)
    enum: ['image', 'document', 'other'],
    required: function() {
      return !!this.attachment; // Required if there's an attachment
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
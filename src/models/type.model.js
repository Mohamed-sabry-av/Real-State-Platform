const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
        lowercase: true,

  },
});

module.exports = mongoose.model("Type", typeSchema);

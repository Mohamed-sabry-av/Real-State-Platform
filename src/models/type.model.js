const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
    buy:{
        type:String,
        required:true
    },
    rent:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("type", typeSchema);

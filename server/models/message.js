const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {type:String,required:true},
    user: {type:String,required:true},
    createdAt:{type:Date, default:Date.now()},
})

module.exports = mongoose.model('Message', schema)
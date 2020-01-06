const mongoose = require("mongoose")

const CommentSchema = new Schema({
    author: {
        _id: { type: Schema.Types.ObjectId, ref: "User" },
        firstName: String,
        lastName: String
    },

    content: {
        type: String,
        maxlength: 150,
        required: true
    }
})

module.exports = mongoose.model("Comment", CommentSchema)
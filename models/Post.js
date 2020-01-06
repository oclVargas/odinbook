const mongoose = require("mongoose")

const PostSchema = new Schema({
    author: {
        _id: { type: Schema.Types.ObjectId, ref: "User" },
        firstName: String,
        lastName: String,
        profile: String
    },

    content: {
        type: String,
        maxlength: 150,
        required: true
    },

    time: {
        type: Date,
        default: Date.now()
    },

    likes: {
        type: Number
    },

    image: {
        type: String
    },

    comments: [
        { type: Schema.Types.ObjectId, ref: "Comment" }
    ]
})

module.exports = mongoose.model("Post", PostSchema)
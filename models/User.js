const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },

    firstName: {
        type: String,
        minlength: 1,
        maxlength: 15,
        required: true
    },

    lastName: {
        type: String,
        minlength: 1,
        maxlength: 20,
        required: true
    },

    password: {
        type: String,
        minlength: 6,
        required: true
    },

    posts: [
        { type: Schema.Types.ObjectId, ref: "Post" }
    ],

    likedPosts: [
        { type: Schema.Types.ObjectId, ref: "Post" }
    ],

    likedComments: [
        { type: Schema.Types.ObjectId, ref: "Post" }
    ],

    friends: [
        { type: Schema.Types.ObjectId, ref: "User" }
    ],

    friendRequests: [
        { type: Schema.Types.ObjectId, ref: "User" }
    ],

    profile: { type: String }
})

// UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
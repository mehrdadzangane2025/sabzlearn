const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const schema = mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "course",
        // required: true,
    },
    article: {
        type: mongoose.Types.ObjectId,
        ref: "Article",
        // required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isAccept: {
        type: Number,
        default: 0,
        required: true,
    },
    score: {
        type: Number,
        default: 5,
    },
    isAnswer: {
        type: Number,
        required: true,
    },
    mainCommentID: {
        type: mongoose.Types.ObjectId,
        ref: "comment",
    },
}, { timestamps: true });

const model = mongoose.model("comment", schema);

module.exports = model;
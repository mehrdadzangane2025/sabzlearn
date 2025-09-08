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
        type: Boolean,
        default: false,

    },
    score: {
        type: Number,
        default: 5,
    },
    isAnswer: {
        type: Boolean,
        default: false,
    },
    mainCommentID: {
        type: mongoose.Types.ObjectId,
        ref: "comment",
    },
}, { timestamps: true });

const model = mongoose.model("comment", schema);

module.exports = model;
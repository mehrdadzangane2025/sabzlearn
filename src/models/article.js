const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    cover: {
        type: [String],
        required: true
    },
    href: {
        type: String,
        required: true
    },
    categoryID: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    creator: {

        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    publish: {
        type: Number, // 0 - 1
        required: true
    },

}, { timestamps: true });

schema.virtual("comments", {
    ref: "comment",
    localField: "_id",
    foreignField: "article",
});

const model = mongoose.model("Article", schema);

module.exports = model;
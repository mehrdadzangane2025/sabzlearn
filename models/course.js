const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    support: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["COMPELETE", "PRESELL", "RUNNING"],
        default: "RUNNING",
    },
    discount: {
        type: Number,
        required: true,
    },
    categoryID: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    countUser: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

schema.virtual("sessions", {
    ref: "session",
    localField: "_id",
    foreignField: "course",
});

schema.virtual("comments", {
    ref: "comment",
    localField: "_id",
    foreignField: "course",
});

const model = mongoose.model("course", schema);

module.exports = model;
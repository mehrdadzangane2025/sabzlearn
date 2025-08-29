const mongoose = require("mongoose");

const schema = mongoose.Schema({
    course: {
        type: mongoose.Types.ObjectId,
        ref: "course",
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const model = mongoose.model("courseUser", schema);

module.exports = model;
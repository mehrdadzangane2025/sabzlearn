    const mongoose = require("mongoose");

    const schema = mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        free: {
            type: Number, // 0 - 1
            required: true,
        },
        video: {
            type: String,
            required: true,
        },
        course: {
            type: mongoose.Types.ObjectId,
            ref: "course",
        },
    }, { timestamps: true });

    const model = mongoose.model("session", schema);

    module.exports = model;
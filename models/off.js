const mongoose = require("mongoose");

const schema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    precent: {
        type: Number,
        required: true
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "course",
        required: true
    },
    max: {
        type: Number, // 1 => 0 
        required: true
    },
    uses: {
        type: Number,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }


}, { timestamps: true });

const model = mongoose.model("off", schema);

module.exports = model;
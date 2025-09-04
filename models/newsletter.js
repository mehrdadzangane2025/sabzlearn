const mongoose = require("mongoose");

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const model = mongoose.model("Newsletter", schema);

module.exports = model;


/*
module.exports = mongoose.model("Newsletter", new mongoose.Schema({
  email: { type: String, required: true },
}, { timestamps: true }));
*/
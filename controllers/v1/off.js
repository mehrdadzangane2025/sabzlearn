const offModel = require("./../../models/off.js");
const courseModel = require("./../../models/course.js");
const mongoose = require("mongoose");

exports.getAll = async(req, res) => {
    const offs = await offModel
        .find({}, "-__v")
        .populate("course", "name href")
        .populate("creator", "name")
        .lean();

    return res.json(offs);
};
exports.create = async(req, res) => {
    const { code, course, precent, max } = req.body;

    const newOff = await offModel.create({
        code,
        course,
        precent,
        max,
        uses: 0,
        creator: req.user._id,
    });
    return res.status(201).json(newOff);
};

exports.setOnAll = async(req, res) => {
    const { discount } = req.body;
    const coursesDiscount = await courseModel.updateMany({ discount });
    return res.json({ message: "disCount set to all courses" });
};
exports.getOne = async(req, res) => {
    const { code } = req.params;
    const { course } = req.body;
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(course);

    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Course ID Not Valid!!" });
    }
    const off = await offModel.findOne({ code, course });

    if (!off) {
        return res.status(404).json({ message: "This code is not motabar" });
    } else if (off.max === off.uses) {
        return res.status(409).json({ message: "This course already Use" })
    } else {
        await offModel.findOneAndUpdate({
            code,
            course
        }, {
            uses: off.uses + 1,
        })
        return res.json({ off, message: "OK NOW!" })
    }


};

exports.remove = async(req, res) => {
    const { id } = req.params;
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Course ID Not Valid!!" });
    }

    const deleteOff = await offModel.findOneAndRemove({ _id: id });
    if (!deleteOff) {
        return res.status(404).json({ message: "Not Found!" });
    }

    return res.json({ deleteOff, message: "Removed!" });
};
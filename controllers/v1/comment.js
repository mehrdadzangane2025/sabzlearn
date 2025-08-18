const commentModel = require("./../../models/comment.js");
const mongoose = require("mongoose");

const courseModel = require("./../../models/course.js");

exports.create = async(req, res) => {
    const { body, score, courseHref } = req.body;
    const course = await courseModel.findOne({ href: courseHref }).lean();
    if (!course) {
        return res.status(400).json({
            message: "course Not Found!!",
        });
    }
    const comment = await commentModel.create({
        body,
        course: course._id,
        score,
        creator: req.user._id,
        isAnswer: 0,
        isAccept: 0,
    });
    return res.status(201).json(comment);
};

exports.remove = async(req, res) => {
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Course ID Not Valid!!" });
    }

    const deletedComment = await commentModel.findOneAndRemove({
        _id: req.params.id,
    });
    if (!deletedComment) {
        return res.status(404).json({ message: "comment ID Not Valid!!" });
    }

    return res.json(deletedComment);
};

exports.accept = async(req, res) => {
    const { id } = req.params;
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Comment ID Not Valid!!" });
    }
    const comment = await commentModel
        .findOneAndUpdate({ _id: id, isAccept: 1 })
        .lean();
    if (!comment) {
        return res.status(404).json({ message: "Comment Not Found!!" });
    }
    return res.json({ comment, message: "Comment Accepted!" });
};
exports.reject = async(req, res) => {
    const { id } = req.params;
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Comment ID Not Valid!!" });
    }
    const comment = await commentModel
        .findOneAndUpdate({ _id: id, isAccept: 0 })
        .lean();
    if (!comment) {
        return res.status(404).json({ message: "Comment Not Found!!" });
    }
    return res.json({ comment, message: "Comment Rejected!" });
};

exports.answer = async(req, res) => {
    const { body } = req.body;
    const acceptedComment = await commentModel.findOneAndUpdate({
        _id: req.params.id,
    }, { isAccept: 1 });

    if (!acceptedComment) {
        return res.status(404).json({ message: "Comment Not Found!" });
    }

    const answerComment = await commentModel.create({
        body,
        course: acceptedComment.course,
        creator: req.user._id,
        isAnswer: 1,
        isAccept: 1,
        mainCommentID: acceptedComment._id,
    });
    return res.status(201).json(answerComment);
};
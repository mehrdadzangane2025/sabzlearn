const commentModel = require("./../../models/comment.js");
const mongoose = require("mongoose");

const articleModel = require("./../../models/article.js");
const courseModel = require("./../../models/course.js");

exports.create = async(req, res) => {
    try {
        const { body, score, courseHref, articleID } = req.body;
        const course = await courseModel.findOne({ href: courseHref }).lean();
        const article = await articleModel.findOne({ _id: articleID }).lean();

        if (!course && !article) {
            return res.status(400).json({
                message: "Not Found!!",
            });
        }

        let comment;

        if (courseHref) {
            comment = await commentModel.create({
                body,
                course: course._id,
                score,
                creator: req.user._id,
                isAnswer: 0,
                isAccept: 0,
            });
        } else {
            comment = await commentModel.create({
                body,
                article: article._id,
                score,
                creator: req.user._id,
                isAnswer: 0,
                isAccept: 0,
            });
        }
        return res.status(201).json(comment);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal Error" });
    }
};

exports.remove = async(req, res) => {
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Comment ID Not Valid!!" });
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
        .findOneAndUpdate({ _id: id }, { isAccept: 1 }, { new: true })
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
        .findOneAndUpdate({ _id: id }, { isAccept: 0 }, { new: true })
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

    let answerComment = null;

    if (acceptedComment.course) {
        answerComment = await commentModel.create({
            body,
            course: acceptedComment.course,
            creator: req.user._id,
            isAnswer: 1,
            isAccept: 1,
            mainCommentID: acceptedComment._id,
        });
    } else {
        answerComment = await commentModel.create({
            body,
            article: acceptedComment.article,
            creator: req.user._id,
            isAnswer: 1,
            isAccept: 1,
            mainCommentID: acceptedComment._id,
        });
    }
    return res.status(201).json(answerComment);
};

exports.getAll = async(req, res) => {
    const comments = await commentModel
        .find({ isAccept: 1 })
        .populate("creator", "-password")
        .populate("course")
        .lean();

    const commentMap = {};
    const commentTree = [];

    comments.forEach((c) => {
        if (!commentMap[c._id]) {
            commentMap[c._id] = {...c, replies: [] };
        }
    });

    comments.forEach((c) => {
        if (c.mainCommentID) {
            if (commentMap[c.mainCommentID]) {
                commentMap[c.mainCommentID].replies.push(commentMap[c._id]);
            }
        } else {
            commentTree.push(commentMap[c._id]);
        }
    });

    res.json({ comments: commentTree });
};
const commentModel = require("./../../models/comment.js");
const mongoose = require("mongoose");

const commentSchema = require("./../../validators/commentValidator.js");

const articleModel = require("./../../models/article.js");

const courseModel = require("./../../models/course.js");

exports.create = async(req, res) => {
    try {
        const { body, score, courseHref, courseID, articleID } = req.body;

        if (articleID && !mongoose.Types.ObjectId.isValid(articleID)) {
            return res
                .status(400)
                .json({ message: "ArticleID is not a valid ObjectId" });
        }

        if (courseID && !mongoose.Types.ObjectId.isValid(courseID)) {
            return res
                .status(400)
                .json({ message: "courseID is not a valid ObjectId" });
        }

        let courseFind = null;

        if (courseHref || courseID) {
            courseFind = await courseModel
                .findOne({
                    $or: [{ href: courseHref || null }, { _id: courseID || null }],
                })
                .lean();
        }

        const articleFind = articleID ?
            await articleModel.findOne({ _id: articleID }).lean() :
            null;

        req.body.article = articleFind ? articleFind._id.toString() : null;
        req.body.course = courseFind ? courseFind._id.toString() : null;
        req.body.creator = req.user._id ? req.user._id.toString() : null;

        if (articleID && !articleFind) {
            return res.status(404).json({ message: "Article not found" });
        }

        if ((courseHref || courseID) && !courseFind) {
            return res.status(404).json({ message: "Course not found" });
        }

        await commentSchema.validate(req.body, { abortEarly: false });

        const comment = await commentModel.create({
            body,
            article: articleFind ? articleFind._id : null,
            course: courseFind ? courseFind._id : null,
            score,
            creator: req.user._id,
            isAnswer: false,
            isAccept: false,
        });

        // if (courseHref) {
        //     comment = await commentModel.create({
        //         body,
        //         course: course._id,
        //         score,
        //         creator: req.user._id,
        //         isAnswer: 0,
        //         isAccept: 0,
        //     });
        // } else {
        //     comment = await commentModel.create({
        //         body,
        //         article: article._id,
        //         score,
        //         creator: req.user._id,
        //         isAnswer: 0,
        //         isAccept: 0,
        //     });
        // }
        return res.status(201).json(comment);
    } catch (e) {
        if (e.name === "ValidationError") {
            return res.status(422).json({ "Message From Yup e.errors": e.errors });
        }

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
        .findOneAndUpdate({ _id: id }, { isAccept: true }, { new: true })
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
        .findOneAndUpdate({ _id: id }, { isAccept: false }, { new: true })
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
    }, { isAccept: true });

    if (!acceptedComment) {
        return res.status(404).json({ message: "Comment Not Found!" });
    }

    const answerComment = await commentModel.create({
        body,
        course: acceptedComment.course || null,
        article: acceptedComment.article || null,
        creator: req.user._id,
        isAnswer: true,
        isAccept: true,
        mainCommentID: acceptedComment._id,
    });
    // if (acceptedComment.course) {
    //     answerComment = await commentModel.create({
    //         body,
    //         course: acceptedComment.course,
    //         creator: req.user._id,
    //         isAnswer: true,
    //         isAccept: true,
    //         mainCommentID: acceptedComment._id,
    //     });
    // } else {
    //     answerComment = await commentModel.create({
    //         body,
    //         article: acceptedComment.article,
    //         creator: req.user._id,
    //         isAnswer: true,
    //         isAccept: true,
    //         mainCommentID: acceptedComment._id,
    //     });
    // }
    return res.status(201).json(answerComment);
};

exports.getAll = async(req, res) => {
    const comments = await commentModel
        .find({ isAccept: true })
        .populate("creator", "-password")
        .populate("course")
        .populate("article")
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
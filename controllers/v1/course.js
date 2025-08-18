const courseModel = require("./../../models/course.js");
const sessionModel = require("./../../models/session.js");
const courseUserModel = require("./../../models/course-user.js");
const categoryModel = require("./../../models/category.js");
const commentModel = require("./../../models/comment.js");
const mongoose = require("mongoose");

module.exports.create = async(req, res) => {
    const {
        name,
        description,
        cover,
        support,
        href,
        price,
        status,
        discount,
        categoryID,
    } = req.body;

    const course = await courseModel.create({
        name,
        description,
        cover: req.file.filename,
        support,
        href,
        price,
        status,
        discount,
        categoryID,
        creator: req.user._id,
    });

    const mainCourse = await courseModel
        .findById(course._id)
        .populate("creator", "-password");

    return res.status(201).json(mainCourse);
};

module.exports.createSession = async(req, res) => {
    const { title, free, time } = req.body;
    const { id } = req.params;
    const session = await sessionModel.create({
        title,
        free,
        time,
        video: "req.file.filename||video.mp4",
        course: id,
    });

    return res.status(201).json(session);
};

module.exports.getAll = async(req, res) => {
    const sessions = await sessionModel
        .find({})
        .populate("course", "name")
        .lean();

    return res.json(sessions);
};

exports.getSessionInfo = async(req, res) => {
    const course = await courseModel.findOne({ href: req.params.href }).lean();

    const session = await sessionModel.findOne({ _id: req.params.sessionID });

    const sessions = await sessionModel.find({ course: course._id });

    return res.json({ session, sessions });
};

exports.removeSession = async(req, res) => {
    const deletedCourse = await sessionModel.findOneAndDelete({
        _id: req.params.id,
    });
    if (!deletedCourse) {
        return res.status(404).json({
            message: "Course not found!!!",
        });
    }

    return res.json(deletedCourse);
};

exports.register = async(req, res) => {
    const isUserAlreadyRegister = await courseUserModel
        .findOne({ user: req.user._id, course: req.params.id })
        .lean();

    if (isUserAlreadyRegister) {
        return res
            .status(409)
            .json({ message: "user Is Already registered in this course!" });
    }

    const register = await courseUserModel.create({
        user: req.user._id,
        course: req.params.id,
        price: req.body.price,
    });

    return res.status(201).json({ message: "You Are Register Successfully!!" });
};

exports.getCoursesByCategory = async(req, res) => {
    const { href } = req.params;
    const category = await categoryModel.findOne({ href });
    if (category) {
        const categoryCourses = await courseModel.find({
            categoryID: category._id,
        });

        res.json(categoryCourses);
    } else {
        res.json([]);
    }
};

exports.getOne = async(req, res) => {
    const course = await courseModel
        .findOne({ href: req.params.href })
        .populate("creator", "-password -__v")
        .populate("categoryID");

    const sessions = await sessionModel.find({ course: course._id }).lean();
    const comments = await commentModel
        .find({ course: course._id, isAccept: 1 })
        .populate("creator", "-password")
        .populate("course")
        .lean();

    const courseUserCount = await courseUserModel
        .find({
            course: course._id,
        })
        .count();

    const isUserRegistredToThisCourse = !!(await courseUserModel.findOne({
        user: req.user._id,
        course: course._id,
    }));

    let allComments = [];
    comments.forEach((comment) => {
        comments.forEach((answerComment) => {
            if (String(answerComment.mainCommentID) === String(comment._id)) {
                allComments.push({
                    ...comment,
                    course: comment.course.name,
                    creator: comment.creator.name,
                    answerComment
                });
            }
        });
    });
    res.json({
        course,
        sessions,
        comments: allComments,
        courseUserCount,
        isUserRegistredToThisCourse,
    });
};

exports.remove = async(req, res) => {
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Course ID Not Valid!!" });
    }
    const deletedCourse = await courseModel.findOneAndRemove({
        _id: req.params.id,
    });
    if (!deletedCourse) {
        return res.status(404).json({ message: "course not found!!" });
    }

    return res.json(deletedCourse);
};

exports.getRelatedCourse = async(req, res) => {
    const href = req.params.href;
    const course = await courseModel.findOne({ href });
    if (!course) {
        return res.status(404).json({ message: "course not found!!" });
    }
    let relatedCourses = await courseModel.find({
        categoryID: course.categoryID,
    });

    relatedCourses = relatedCourses.filter((course) => course.href !== href);

    return res.json(relatedCourses);
};
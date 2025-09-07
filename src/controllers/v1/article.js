const mongoose = require("mongoose");
const commentModel = require("../../models/comment.js");
const buildCommentTree = require("../../utils/commentbuild.js");
const articleModel = require("../../models/article.js");

exports.getAll = async(req, res) => {
    const allArticle = await articleModel.find({}).lean();
    return res.json(allArticle);
};

exports.create = async(req, res) => {
    const { title, description, body, href, categoryID, publish } =
    req.body;

    let cover = [];

    req.files.forEach(n => cover.push(n.filename));


    const hrefRepeat = await articleModel.findOne({ href });
    if (hrefRepeat) {
        return res.status(409).json({ message: "this href already exist!" });
    }



    const createArticle = await articleModel.create({
        title,
        description,
        body,
        cover,
        href,
        categoryID,
        creator: req.user._id,
        publish,
    });

    return res.json({ message: "Done NOW!" });
};

exports.getOne = async(req, res) => {
    const { keyword } = req.params;

    const findArticle = await articleModel.findOne({
        $or: [{
            href: {
                $regex: ".*" + keyword + ".*",
                $options: "i"
            },
        }, {
            description: {
                $regex: ".*" + keyword + '.*',
                $options: "i"
            }
        }, {
            title: {
                $regex: ".*" + keyword + '.*',
                $options: "i"
            }
        }]
    }).populate('creator', 'name -_id').lean();

    if (!findArticle) {
        return res.status(404).json({ message: "article Not Found!!" })
    }

    const comments = await commentModel
        .find({ article: findArticle._id, isAccept: 1 }).populate('creator', "name -_id").lean();

    const commentTree = buildCommentTree(comments, findArticle._id);


    return res.json({ article: findArticle, comments: commentTree })

};

exports.remove = async(req, res) => {};

exports.saveDraft = async(req, res) => {};
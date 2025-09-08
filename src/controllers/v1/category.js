const categoryModel = require("./../../models/category.js");
const mongoose = require("mongoose");
exports.create = async(req, res) => {
    const { title, href } = req.body;
    const category = await categoryModel.create({ title, href });
    return res.status(201).json({
        category,
    });
};
exports.getAll = async(req, res) => {
    const categories = await categoryModel.find({});
    return res.json(categories);
};
exports.update = async(req, res) => {
    const id = req.params.id;
    const { title, href } = req.body;
    const isValidUserID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidUserID) {
        return res.status(409).json({
            message: "category Id is Not Valid!!",
        });
    }
    const updatedCategory = await categoryModel.findOneAndUpdate({
        _id: id,
    }, {
        title,
        href,
    });
    if (!updatedCategory) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    return res.status(201).json(updatedCategory);
};
exports.remove = async(req, res) => {
    const id = req.params.id;
    const isValidUserID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidUserID) {
        return res.status(409).json({
            message: "category Id is Not Valid!!",
        });
    }
    const removedCategory = await categoryModel.findByIdAndRemove(id);
    if (!removedCategory) {
        return res.status(404).json({
            message: "Category not found",
        });
    }
    return res.json({ removedCategory });
};
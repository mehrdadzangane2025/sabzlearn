const mongoose = require("mongoose");

const courseUserModel = require("./../../models/course-user.js");

exports.getAll = async(req, res) => {
    const orders = await courseUserModel.find({ user: req.user._id }).populate('course').lean();
    return res.json(orders);
};

exports.getOne = async(req, res) => {
    const { id } = req.params;

    const isValidUserID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidUserID) {
        return res.status(409).json({
            message: "Id is Not Valid!!",
        });
    }

    const order = await courseUserModel.findOne({ _id: id }).populate("course").lean();

    return res.json(order);
};

/*$or: [{
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
        }]*/
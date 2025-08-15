const banUserModel = require("./../../models/ban-phone.js");
const userModel = require("./../../models/user.js");
const mongoose = require("mongoose");

exports.banUser = async(req, res) => {
    const mainUser = await userModel.findOne({ _id: req.params.id }).lean();

    const banUserResult = await banUserModel.create({ phone: mainUser.phone });

    if (banUserResult) {
        return res.json({ message: "User Ban SuccessFully!!" });
    }
    return res.status(500).json({ message: "Server Error!!" });
};

exports.getAll = async(req, res) => {
    const users = await userModel.find().select("-password").lean();

    return res.json(users);
};

exports.removeUser = async(req, res) => {
    const isValidUserID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidUserID) {
        return res.status(409).json({
            message: "UserId is Not Valid!!",
        });
    }

    const removeUser = await userModel.findByIdAndRemove(req.params.id);

    if (!removeUser) {
        return res.status(404).json({ messsage: "there is no user!" });
    } else {
        return res.json({
            message: "user remove successfully!!",
        });
    }
};

exports.changeRole = async(req, res) => {
    const { id } = req.body;
    const isValidUserID = mongoose.Types.ObjectId.isValid(id);
    if (!isValidUserID) {
        return res.status(409).json({
            message: "UserId is Not Valid!!",
        });
    }

    const user = await userModel.findOne({ _id: id });
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    await userModel.findOneAndUpdate({ _id: id }, { role: newRole });
    return res.json({ message: `$info : username => ${user.username} && Role => changed to ${newRole}` });
};
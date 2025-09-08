const banUserModel = require("./../../models/ban-phone.js");
const userModel = require("./../../models/user.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    try {
        const { id } = req.body;
        const isValidUserID = mongoose.Types.ObjectId.isValid(id);
        if (!isValidUserID) {
            const err = new Error("UserId is Not Valid");
            err.status = 409
            throw err;
        }

        const user = await userModel.findOne({ _id: id });
        if (!user) {
            const err = new Error("User Not Found");
            err.status = 422
            throw err;
        }
        const roles = ["ADMIN", "TEACHER", "USER"];
        const currentRole = roles.findIndex(r => r.toUpperCase() === user.role.trim().toUpperCase());
        const newRole = roles[(currentRole + 1) % roles.length];

        // console.log(user.role);
        // console.log(currentRole);
        // console.log(newRole);



        await userModel.findOneAndUpdate({ _id: id }, { role: newRole }, { new: true });
        return res.json({
            message: `info : username => ${user.username} && Role => changed to ${newRole}`,
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

exports.updateUser = async(req, res) => {
    const { email, name, username, password, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { name, username, email, password: hashedPassword, phone });
    const userObject = user.toObject();
    Reflect.deleteProperty(userObject, "password");
    return res.json({
        userObject,
    });
};
const banUserModel = require("./../../models/ban-phone.js");
const userModel = require("./../../models/user.js");

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

};
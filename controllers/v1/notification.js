const notificationModel = require("./../../models/notification.js");

exports.seen = async(req, res) => {
    const { id } = req.params;
    //Validate
    const notif = await notificationModel.findOneAndUpdate({ _id: id }, { seen: 1 });
    return res.json(notif)
};
exports.create = async(req, res) => {
    const { message, admin } = req.body;
    const notification = await notificationModel.create({
        message,
        admin,
    });
    return res.status(201).json(notification);
};
exports.get = async(req, res) => {
    const { _id } = req.user;
    const adminNotification = await notificationModel.find({ admin: _id }).lean();
    return res.json(adminNotification);
};

exports.getAll = async(req, res) => {
    const notification = await notificationModel.find({}).lean();
    return res.json(notification);
};

exports.remove = async(req, res) => {};
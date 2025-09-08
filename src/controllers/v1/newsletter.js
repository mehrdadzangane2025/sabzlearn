const newsletterModel = require("./../../models/newsletter.js");
exports.getAll = async(req, res) => {
    const newsletter = await newsletterModel.find().lean();

    return res.json(newsletter);
};
exports.create = async(req, res) => {
    const { email } = req.body;
    const newEmail = await newsletterModel.create({ email });
    return res.json(newEmail);
};
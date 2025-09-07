const menuModel = require("./../../models/menu.js");
const menuShow = require("./../../utils/showMenu.js");


exports.create = async(req, res) => {
    const { title, href, parent } = req.body;

    const menu = await menuModel.create({
        title,
        href,
        parent
    });

    return res.status(201).json(menu);
};
exports.remove = async(req, res) => {};
exports.getAll = async(req, res) => {};
exports.getAllInPanel = async(req, res) => {
    const allMenu = await menuModel.find().populate('parent').lean();

    const answer = menuShow(allMenu);
    return res.json(answer)
};
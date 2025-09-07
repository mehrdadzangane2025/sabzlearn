const courseModel = require("./../../models/course");
const mongoose = require("mongoose");

exports.get = async(req, res) => {
    const { keyword } = req.params;
    const courses = await courseModel.find({
        $or: [{
                name: {
                    $regex: ".*" + keyword + ".*",
                    $options: "i",
                }
            },
            {
                description: {
                    $regex: ".*" + keyword + ".*",
                    $options: "i",
                }
            },
        ]
    });
    return res.json(courses);
};
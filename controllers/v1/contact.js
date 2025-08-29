const contactModel = require("./../../models/contact.js");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

exports.getAll = async(req, res) => {
    const contacts = await contactModel.find({});
    return res.json(contacts);
};

exports.create = async(req, res) => {
    const { name, email, phone, body } = req.body;
    const contact = await contactModel.create({
        name,
        email,
        phone,
        body,
        answer: 0,
    });

    return res.status(201).json(contact);
};

exports.remove = async(req, res) => {
    const { id } = req.params;
    const isObjectIDValid = mongoose.Types.ObjectId.isValid(id);

    if (!isObjectIDValid) {
        return res.status(409).json({ message: "Course ID Not Valid!!" });
    }

    const removeContact = await contactModel.findOneAndRemove({ _id: id });
    if (!removeContact) {
        return res.status(404).json({ message: "Not Found!" });
    }
    return res.json({ removeContact, message: "removed" });
};

exports.answer = async(req, res) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mehrdadzangane2024@gmail.com",
            pass: "biee laxi eija xfah",
        },
    });
    const mailOptions = {
        from: "mehrdadzangane2024@gmail.com",
        to: req.body.email,
        subject: "پاسخ پیغام شما از طرف سبزلرن",
        text: req.body.answer,
    };

    transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
            return res.json({ message: error });
        } else {
            const contact = await contactModel.findOneAndUpdate({ email: req.body.email }, { answer: 1 });
            return res.json({
                message: "email send successfully",
            });
        }
    });
};
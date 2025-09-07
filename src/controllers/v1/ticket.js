const departmentModel = require("../../models/department.js");
const departmentsSubsModel = require("../../models/department-sub.js");
const ticketsModel = require("../../models/ticket.js");
const mongoose = require("mongoose");

exports.userTickets = async(req, res) => {
    const tickets = await ticketsModel
        .find({ user: req.user._id })
        .sort({ _id: -1 })
        .populate("departmentID")
        .populate("departmentSubID")
        .populate("user")
        .lean();

    return res.json(tickets)
};
exports.departments = async(req, res) => {
    const departments = await departmentModel.find({});
    return res.json(departments);
};
exports.departmentsSubs = async(req, res) => {
    const departmenSub = await departmentsSubsModel
        .find({ parent: req.params.id })
        .lean();
    return res.json(departmenSub);
};
exports.getAll = async(req, res) => {
    const ticket = await ticketsModel
        .find({ answer: 0 })
        .populate("departmentID", "title")
        .populate("departmentSubID", "title")
        .populate("user", "name")
        .lean();

    return res.json(ticket);
};
exports.setAnswer = async(req, res) => {
    const { body, ticketID } = req.body;

    const isValidTicketID = mongoose.Types.ObjectId.isValid(ticketID);
    if (!isValidTicketID) {
        return res.status(409).json({ message: "Ticket ID Not Valid!!" });
    }
    const ticket = await ticketsModel.findOne({ _id: ticketID });
    if (!ticket) {
        return res.status(404).json({ message: "Ticket Not Found!!" });
    }

    const answer = await ticketsModel.create({
        title: "پاسخ تیکت شما!",
        body,
        parent: ticketID,
        priority: ticket.priority,
        user: req.user._id,
        isAnswer: 1,
        answer: 0,
        departmentID: ticket.departmentID,
        departmentSubID: ticket.departmentSubID,
    });

    await ticketsModel.findOneAndUpdate({ _id: ticketID }, { answer: 1 });
    return res.status(201).json(answer);
};
exports.getAnswer = async(req, res) => {
    const { id } = req.params;
    const mainTicket = await ticketsModel.findOne({ _id: id });
    const answerTicket = await ticketsModel.findOne({ parent: id });

    return res.json({
        mainTicket,
        answerTicket: answerTicket ?
            answerTicket : { message: "still not responding!" },
    });
};
exports.create = async(req, res) => {
    const { departmentID, departmentSubID, priority, title, body, course } =
    req.body;

    const ticket = await ticketsModel.create({
        departmentID,
        departmentSubID,
        priority,
        title,
        body,
        course,
        user: req.user._id,
        answer: 0,
        isAnswer: 0,
    });

    const mainTicket = await ticketsModel
        .findOne({ _id: ticket._id })
        .populate("departmentID")
        .populate("departmentSubID")
        .populate("user")
        .lean();

    return res.status(201).json(mainTicket);
};
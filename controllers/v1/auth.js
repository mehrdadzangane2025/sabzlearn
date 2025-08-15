const userModel = require("./../../models/user.js");

const userbanModel = require("./../../models/ban-phone.js");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const registerValidator = require("./../../validators/register.js");

exports.register = async(req, res) => {
    const validationResult = registerValidator(req.body);

    if (validationResult !== true) {
        return res.status(422).json(validationResult);
    }

    const { username, name, phone, password, email } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (isUserExists) {
        return res.status(409).json({
            message: "Username or email already exists",
        });
    }
    const isUserBan = await userbanModel.find({ phone });

    if (isUserBan.length) {
        return res.status(409).json({ message: "This phone number ban!!" });
    }

    const countOfUsers = await userModel.count();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        name,
        phone,
        password: hashedPassword,
        role: countOfUsers > 0 ? "USER" : "ADMIN",
    });
    const userObject = user.toObject();

    Reflect.deleteProperty(userObject, "password");

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30 day",
    });
    console.log(accessToken);

    return res.status(201).json({ userObject, accessToken });
};

exports.login = async(req, res) => {
    const { identifier, password } = req.body;
    const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
        return res.status(401).json({ message: "Username and Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Password is not valid" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30 day",
    });

    return res.json(accessToken)
};

exports.getMe = async(req, res) => {};;
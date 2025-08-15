const jwt = require("jsonwebtoken");
const userModel = require("./../models/user.js");

module.exports = async(req, res, next) => {
    // prettier-ignore
    const authHeaderRaw = req.header("Authorization");
    const authHeader = authHeaderRaw && authHeaderRaw.split(" ");
    if (!authHeaderRaw) {
        console.log("if in authHeaderRaw");
        return res.status(403).json({ message: "Authorization header missing" });

    }
    if (authHeader.length !== 2) {
        console.log("if in authHeader");

        return res.status(403).json({ message: "Authorization header missing" });

    }

    const token = authHeader[1];

    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(jwtPayload.id).lean();

        Reflect.deleteProperty(user, "password");

        req.user = user;

        next();
    } catch (e) {
        return res.json(e);
    }
};
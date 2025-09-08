const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

module.exports = async(req, res, next) => {
    // prettier-ignore
    const authHeaderRaw = req.header("Authorization");
    const authHeader = authHeaderRaw && authHeaderRaw.split(" ");
    if (!authHeaderRaw) {

        return res.status(403).json({ message: "Authorization header missing" });

    }
    if (authHeader.length !== 2) {

        return res.status(403).json({ message: "Authorization header must be bearer token" });

    }

    const token = authHeader[1];

    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(jwtPayload.id).lean();

        if (!user) {
            return res.status(404).json({ message: "User Not Found!" })
        }

        Reflect.deleteProperty(user, "password");

        req.user = user;

        next();
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
module.exports = async(req, res, next) => {

    if (req.user.role === "TEACHER" || req.user.role === "ADMIN") {
        return next();
    }

    return res.status(403).json({
        message: " This Route Is Not Accessible For Normal User!!",
    });
};
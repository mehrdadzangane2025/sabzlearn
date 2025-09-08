module.exports = async(req, res, next) => {
    const isTeacher = req.user.role === "TEACHER";

    console.log(req.user);

    if (isTeacher) {
        return next();
    }

    return res.status(403).json({
        message: " This Route Is Not Accessible For Normal User!!",
    });
};
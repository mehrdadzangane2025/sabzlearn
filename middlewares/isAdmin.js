module.exports = async(req, res, next) => {
    const isAdmin = req.user.role === "ADMIN";
    if (isAdmin) {
        return next();
    }

    return res.status(403).json({
        message: " This Route Is Not Accessible for User!!",
    });
};
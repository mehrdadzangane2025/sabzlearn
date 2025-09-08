const express = require("express");

const orderRouter = require("./routes/v1/order.js"); //**************** */

const path = require("path");

const bodyParser = require("body-parser");

const cors = require("cors");

const authRouter = require("./routes/v1/auth.js");

const userRouter = require("./routes/v1/user.js");

const categoryRouter = require("./routes/v1/category.js");

const courseRouter = require("./routes/v1/course.js");

const contactRouter = require("./routes/v1/contact.js");

const commentRouter = require("./routes/v1/comment.js");

const newsLetterRouter = require("./routes/v1/newsletter.js");

const searchRouter = require("./routes/v1/search.js");

const notificationRouter = require("./routes/v1/notification.js");

const offRouter = require("./routes/v1/off.js");

const articleRouter = require("./routes/v1/article.js");

const ticketRouter = require("./routes/v1/ticket.js");

const menuRouter = require("./routes/v1/menu.js");

const app = express();
app.use(express.json());

// app.use(bodyParser.json()); // app.use(express.json()); after express 4.16+

// app.use(bodyParser.urlencoded({ extended: false })); //app.use(express.urlencoded({ extended: true }));
app.use("/v1/auth/", authRouter);
app.use("/v1/users/", userRouter);
app.use("/v1/category/", categoryRouter);
app.use("/v1/courses/", courseRouter);
app.use("/v1/contact/", contactRouter);
app.use("/v1/comment/", commentRouter);
app.use("/v1/newsletter/", newsLetterRouter);
app.use("/v1/search/", searchRouter);
app.use("/v1/notification/", notificationRouter);
app.use("/v1/off/", offRouter);
app.use("/v1/article/", articleRouter);
app.use("/v1/order/", orderRouter);
app.use("/v1/ticket/", ticketRouter);
app.use("/v1/menu/", menuRouter);

app.use(
    "/courses/covers",
    express.static(path.join(__dirname, "public", "courses", "covers"))
);

/*
app.get("/courses/covers/:filename", (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, "public", "courses", "covers", fileName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
});
*/
app.use(cors());

module.exports = app;
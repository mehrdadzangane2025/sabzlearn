const express = require("express");

const path = require("path");

const bodyParser = require("body-parser");

const cors = require("cors");

const authRouter = require("./routes/v1/auth.js");

const userRouter = require("./routes/v1/user.js");

const app = express();
app.use(express.json());

// app.use(bodyParser.json()); // app.use(express.json()); after express 4.16+

// app.use(bodyParser.urlencoded({ extended: false })); //app.use(express.urlencoded({ extended: true }));
app.use("/v1/auth/", authRouter);
app.use("/v1/users/", userRouter);

app.use(
    "/courses/covers",
    express.static(path.join(__dirname, "public", "courses", "covers"))
);

app.use(cors());

module.exports = app;
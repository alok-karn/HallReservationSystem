const path = require("path");
const express = require("express");
const viewRouter = require("././backend/routers/viewRouters");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./frontend/views"));

app.use(express.static(path.join(__dirname, "./frontend/public")));

// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message:
//         "Too many requests from this IP, Please try again after an hour 😞",
// });

app.use("/", viewRouter);
// app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

module.exports = app;

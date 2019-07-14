"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const hbs = require("hbs");

const indexRoute = require("./routes/index");
const users = require("./routes/users");
const gameMachines = require("./routes/game-machines");
const casinos = require("./routes/casinos");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname + "/views"));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set endpoints
app.use("/", indexRoute);
app.use("/users", users);
app.use("/game-machines", gameMachines);
app.use("/casinos", casinos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
    res.status(err.statusCode || 500);
    res.render("error", {
        statusCode: res.statusCode,
        error: err.message,
        errorDev: (app.get("env") === "development") ? err : {}
    });
});


module.exports = app;
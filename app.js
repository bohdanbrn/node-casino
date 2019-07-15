"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const expressSession = require("express-session");
const flash = require("connect-flash");
const hbs = require("hbs");

// client side
const auth = require("./routes/auth");
const users = require("./routes/users");
const gameMachines = require("./routes/game-machines");
const casinos = require("./routes/casinos");
// dashboard
const dashboardAuth = require("./routes/dashboard/auth");
const dashboardCasinos = require("./routes/dashboard/casinos");

const app = express();

// load passport strategies
require("./config/passport.js")(passport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname + "/views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// For Passport
app.use(expressSession({
    secret: "keyboard cat", // TODO (.env)
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Connect flash
app.use(flash());
// Global Vars
app.use((req, res, next) => {
    res.locals.alertMessages = req.flash("alertMessages");
    next();
});

// set endpoints
app.use("/", auth);
app.use("/users", users);
app.use("/game-machines", gameMachines);
app.use("/casinos", casinos);
app.use("/dashboard", dashboardAuth);
app.use("/dashboard/casinos", dashboardCasinos);

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
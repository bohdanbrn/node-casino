"use strict";

const userAuth = async(req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user && req.user.role === "user") {
            return next();
        }
        else if (req.user && req.user.role === "admin") {
            req.flash("alertMessages", "Admins can't play games!");
        }
    }

    res.redirect("/");
};

module.exports = userAuth;
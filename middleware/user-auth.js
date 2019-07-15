"use strict";

const userAuth = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("alertMessages", "Please Sign In to play.");
    res.redirect("/");
};

module.exports = userAuth;
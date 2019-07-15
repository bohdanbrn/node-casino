"use strict";

const userAuth = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

module.exports = userAuth;
"use strict";

const adminAuth = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/dashboard");
};

module.exports = adminAuth;
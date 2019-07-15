"use strict";

const adminAuth = async (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user && req.user.role === "admin") {
            return next();
        }
        else if (req.user && req.user.role === "user") {
            req.flash("alertMessages", "Simple users can't login into dashboard!");
        }
    }
    
    res.redirect("/dashboard");
};

module.exports = adminAuth;
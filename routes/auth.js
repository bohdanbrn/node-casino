"use strict";

const express = require("express");
const router = new express.Router();
const passport = require("passport");


/**
 * Sign in for User
 */
router.get("", function(req, res) {
    res.render("signin", {
        headTitle: "Sign In",
        pageTitle: "Sign In"
    });
});

/**
 * Sign in for User
 */
router.post("", passport.authenticate("local-signin",
    {
        successRedirect: "/casinos",
        failureRedirect: "/"
    }
));

/**
 * Create new User
 */
router.get("/signup", function(req, res) {
    res.render("signup", {
        headTitle: "Sign Up",
        pageTitle: "Sign Up"
    });
});

/**
 * Create new User
 */
router.post("/signup", passport.authenticate("local-signup",
    {
        successRedirect: "/",
        failureRedirect: "/signup"
    }
));

/**
 * Logout for User
 */
router.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        }
        
        res.redirect("/");
    });
});


module.exports = router;
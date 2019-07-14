"use strict";

const express = require("express");
const router = new express.Router();
const models = require("../../models");
var bcrypt = require("bcrypt-nodejs");
const passport = require("passport");


/**
 * Sign in for User
 */
router.get("/signin", function(req, res) {
    res.render("dashboard/signin", {
        headTitle: "Sign In",
        pageTitle: "Sign In"
    });
});

/**
 * Sign in for User
 */
router.post("/signin", passport.authenticate("local-signin",
    {
        successRedirect: "/dashboard/casinos",
        failureRedirect: "/dashboard/signin"
    }
));

/**
 * Create new User
 */
router.get("/signup", function(req, res) {
    res.render("dashboard/signup", {
        headTitle: "Sign Up",
        pageTitle: "Sign Up"
    });
});

/**
 * Create new User
 */
router.post("/signup", passport.authenticate("local-signup",
    {
        successRedirect: "/dashboard/signin",
        failureRedirect: "/dashboard/signup"
    }
));

/**
 * Logout for User
 */
router.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/");
    });
});


module.exports = router;
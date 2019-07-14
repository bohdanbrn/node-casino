"use strict";

const express = require("express");
const router = express.Router();

/**
 * User login page
 */
router.get("/", function(req, res) {
    res.render("user-login", {
        headTitle: "Sign in",
        pageTitle: "Sign in"
    });
});


module.exports = router;
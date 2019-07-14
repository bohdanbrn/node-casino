"use strict";

const userAuth = async(req, res, next) => {
    try {
        let casinoCookie = req.cookies.megaCasino;

        // check if the client sent a cookie
        if (casinoCookie) {
            // check if cookie is contain correct data
            if (!casinoCookie.username || !casinoCookie.usermoney) {
                throw new Error("Plese authenticate.");
            }
        }
        else {
            // check if client sent name and money
            if (!req.query.username || !req.query.usermoney) {
                throw new Error("Plese authenticate.");
            }

            casinoCookie = {
                username: req.query.username,
                usermoney: req.query.usermoney
            };

            // set a new cookie
            res.cookie("megaCasino", casinoCookie, {
                maxAge: 86400,  // one day
                httpOnly: true
            });
        }

        // set variable with user data
        req.user = {
            name: casinoCookie.username,
            money: casinoCookie.usermoney
        };
        
        next();
    } catch(e) {
        res.status(401).render("error", {
            statusCode: res.statusCode,
            error: e.message
        });
    }
};

module.exports = userAuth;
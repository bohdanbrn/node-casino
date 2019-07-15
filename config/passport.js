const bcrypt = require("bcrypt-nodejs");
const LocalStrategy = require("passport-local").Strategy;
const models = require("../models");

module.exports = function(passport) {
    const User = models.User;

    // serialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user 
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
    
            } else {
                done(user.errors, null);
            }
        });
    });

    // LOCAL SIGNUP
    passport.use("local-signup", new LocalStrategy(
        {
            usernameField: "name",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, name, password, done) {
            // check passwords
            if (password !== req.body.password2) {
                req.flash("alertMessages", "Passwords don't match.");
                return done(null, false, {});
            }

            const generateHash = function(password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: {
                    name: name
                }
            }).then(function(user) {
                if (user) {
                    req.flash("alertMessages", "That name is already taken.");
                    return done(null, false, {});
                } else {
                    const userPassword = generateHash(password);
                    const data = {
                        name: name,
                        password: userPassword
                    };

                    if (req.body.money) {
                        data.money = req.body.money;
                    }

                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }

                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }

    ));

    // LOCAL SIGNIN
    passport.use("local-signin", new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with name
            usernameField: "name",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, name, password, done) {
            const User = models.User;
    
            const isValidPassword = function(userpass, password) {
                return bcrypt.compareSync(password, userpass);
            };
    
            User.findOne({
                where: {
                    name: name
                }
            }).then(function(user) {
                if (!user) {
                    req.flash("alertMessages", "User does not exist.");
                    return done(null, false, {});
                }
    
                if (!isValidPassword(user.password, password)) {
                    req.flash("alertMessages", "Incorrect password.");
                    return done(null, false, {});
                }
    
                const userinfo = user.get();
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("Error:", err.message);
                req.flash("alertMessages", "Something went wrong.");
                return done(null, false, {});
            });
    
        }
    
    ));

};
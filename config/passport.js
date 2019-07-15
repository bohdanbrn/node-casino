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
        async function(req, name, password, done) {
            try {
                // check passwords
                if (password !== req.body.password2) {
                    req.flash("alertMessages", "Passwords don't match.");
                    return done(null, false, {});
                }

                const generateHash = function(password) {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                };

                const user = await User.findOne({
                    where: {
                        name: name
                    }
                });
                
                if (user) {
                    req.flash("alertMessages", "That name is already taken.");
                    return done(null, false, {});
                }

                const userPassword = generateHash(password);
                const data = {
                    name: name,
                    password: userPassword
                };

                if (req.body.money) {
                    data.money = req.body.money;
                }
                if (req.body.role) {
                    data.role = req.body.role;
                }

                User.create(data).then(function(newUser, created) {
                    if (!newUser) {
                        req.flash("alertMessages", "User not registered.");
                        return done(null, false);
                    }

                    if (newUser) {
                        req.flash("alertMessages", "User is successfully registered.");
                        return done(null, newUser);
                    }
                });
            } catch(e) {
                console.log("Error:", e.message);
                req.flash("alertMessages", "Something went wrong.");
                return done(null, false, {});
            }
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
        async function(req, name, password, done) {
            try {
                const isValidPassword = function(userpass, password) {
                    return bcrypt.compareSync(password, userpass);
                };
        
                const user = await User.findOne({
                    where: {
                        name: name
                    }
                });

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
            } catch(e) {
                console.log("Error:", e.message);
                req.flash("alertMessages", "Something went wrong.");
                return done(null, false, {});
            }
        }

    ));

};
var bcrypt = require("bcrypt-nodejs");

module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require("passport-local").Strategy;

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
            var generateHash = function(password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: {
                    name: name
                }
            }).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: "That name is already taken"
                    });
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        name: name,

                        password: userPassword,

                        firstname: req.body.firstname,

                        lastname: req.body.lastname

                    };

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
            var User = user;
    
            var isValidPassword = function(userpass, password) {
                return bcrypt.compareSync(password, userpass);
            };
    
            User.findOne({
                where: {
                    name: name
                }
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: "Email does not exist"
                    });
                }
    
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: "Incorrect password."
                    });
    
                }
    
                var userinfo = user.get();
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: "Something went wrong with your Signin"
                });
            });
    
        }
    
    ));

};
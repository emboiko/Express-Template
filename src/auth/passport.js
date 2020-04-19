const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

function initializePassport(passport) {

    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: "No user with that username." });

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password." })
            }
        } catch (err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        const user = await User.findOne({ _id: id })
        return done(null, user);
    });

}

const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const notAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

module.exports = { initializePassport, authenticated, notAuthenticated };
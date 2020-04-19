const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const { notAuthenticated } = require("../auth/passport");

const router = new express.Router();

router.get("/register", notAuthenticated, (req, res) => {
    res.render("register");
});

router.post("/register", notAuthenticated, async (req, res) => {
    const user = new User(req.body);
    try {
        await User.validateRegistration(user.email, user.username);
        await user.save();
        res.render("login", { message: "Account created, please login with your new credentials." });
    } catch (err) {
        res.render("register", { message: err.message });
    }
});

router.get("/login", notAuthenticated, (req, res) => {
    res.render("login");
});

router.post("/login", notAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    res.render("logout")
});

router.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

module.exports = router;